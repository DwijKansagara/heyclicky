import { GoogleGenAI } from '@google/genai';
import { HEYCLICKY_CORE_SYSTEM_PROMPT } from './prompts.js';
import { parsePointTags, parseDrawTags, parseScene3DTags } from '../primitives.js';
import { PointingTarget, ScreenDrawing, ThreeSceneDefinition } from '../types.js';

export interface GeminiRequestOptions {
  apiKey: string;
  model?: string;
  systemPrompt?: string;
  userPrompt: string;
  screenshotBase64?: string;
  conversationHistory?: { role: 'user' | 'assistant'; text: string }[];
  isHighReasoning?: boolean;
}

export interface GeminiResponsePayload {
  rawText: string;
  spokenText: string;
  pointingTargets: PointingTarget[];
  drawings: ScreenDrawing[];
  scenes3D: ThreeSceneDefinition[];
  tokenUsage?: { promptTokens: number; candidateTokens: number; totalTokens: number };
}

export class GeminiEngine {
  private client: GoogleGenAI | null = null;
  private currentApiKey: string = '';

  constructor(apiKey?: string) {
    if (apiKey) {
      this.initClient(apiKey);
    }
  }

  public initClient(apiKey: string) {
    this.currentApiKey = apiKey;
    this.client = new GoogleGenAI({ apiKey });
  }

  /**
   * Smart model routing:
   * Low latency voice/vision/pointing -> Gemini Flash (e.g. gemini-2.5-flash)
   * Deep reasoning / Agents / 3D scenes -> Gemini Pro (e.g. gemini-2.5-pro)
   */
  public resolveModel(isHighReasoning: boolean, userConfiguredModel?: string): string {
    if (userConfiguredModel && userConfiguredModel.trim().length > 0) {
      return userConfiguredModel;
    }
    return isHighReasoning ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
  }

  public async generateTurn(options: GeminiRequestOptions): Promise<GeminiResponsePayload> {
    const model = options.model || this.resolveModel(options.isHighReasoning ?? false);

    // If no client or no key, return an honest, friendly configuration message
    if (!this.client && !options.apiKey) {
      const fallbackMsg = "hey! i'm ready to help, but i need your google gemini api key. you can get a free key at aistudio.google.com and paste it in settings!";
      return {
        rawText: fallbackMsg,
        spokenText: fallbackMsg,
        pointingTargets: [],
        drawings: [],
        scenes3D: [],
      };
    }

    if (!this.client || this.currentApiKey !== options.apiKey) {
      this.initClient(options.apiKey);
    }

    const contents: any[] = [];

    // Add conversation history
    if (options.conversationHistory && options.conversationHistory.length > 0) {
      for (const item of options.conversationHistory) {
        contents.push({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.text }],
        });
      }
    }

    // Current turn content
    const currentParts: any[] = [];
    if (options.screenshotBase64) {
      const cleanBase64 = options.screenshotBase64.replace(/^data:image\/\w+;base64,/, '');
      currentParts.push({
        inlineData: {
          mimeType: 'image/png',
          data: cleanBase64,
        },
      });
    }

    currentParts.push({ text: options.userPrompt });
    contents.push({ role: 'user', parts: currentParts });

    try {
      const response = await this.client!.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: options.systemPrompt || HEYCLICKY_CORE_SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });

      const rawText = response.text || '';
      return this.processModelOutput(rawText, response.usageMetadata);
    } catch (err: any) {
      console.error('Gemini API execution error:', err);
      // Friendly rate limit or error recovery
      const isRateLimit = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('Quota');
      const errorMsg = isRateLimit
        ? "whoops, hit google's free tier rate limit for a second! give it just a moment and try again."
        : `ran into an issue reaching gemini: ${err?.message || 'unknown error'}. please check your key in settings!`;

      return {
        rawText: errorMsg,
        spokenText: errorMsg,
        pointingTargets: [],
        drawings: [],
        scenes3D: [],
      };
    }
  }

  /**
   * Extracts tags for pointing, 2D drawing, and 3D scenes,
   * leaving clean text for spoken audio.
   */
  public processModelOutput(rawText: string, usageMetadata?: any): GeminiResponsePayload {
    // 1. Extract 3D scenes
    const { cleanText: textAfter3D, scenes } = parseScene3DTags(rawText);

    // 2. Extract 2D drawings
    const { cleanText: textAfterDraw, drawings } = parseDrawTags(textAfter3D);

    // 3. Extract pointing targets
    const { cleanText: cleanSpokenText, targets } = parsePointTags(textAfterDraw);

    return {
      rawText,
      spokenText: cleanSpokenText,
      pointingTargets: targets,
      drawings,
      scenes3D: scenes,
      tokenUsage: usageMetadata
        ? {
            promptTokens: usageMetadata.promptTokenCount ?? 0,
            candidateTokens: usageMetadata.candidatesTokenCount ?? 0,
            totalTokens: usageMetadata.totalTokenCount ?? 0,
          }
        : undefined,
    };
  }
}
