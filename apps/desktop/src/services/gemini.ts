import { GeminiEngine, GeminiResponsePayload } from '@heyclicky/shared';
import { loadUserSettings } from './storage.js';

let engine: GeminiEngine | null = null;

export async function getGeminiEngine(): Promise<GeminiEngine> {
  if (!engine) {
    const settings = await loadUserSettings();
    engine = new GeminiEngine(settings.geminiApiKey);
  }
  return engine;
}

export async function askHeyClicky(
  prompt: string,
  options: {
    isHighReasoning?: boolean;
    includeScreenContext?: boolean;
    conversationHistory?: { role: 'user' | 'assistant'; text: string }[];
  } = {}
): Promise<GeminiResponsePayload> {
  const settings = await loadUserSettings();
  const currentEngine = await getGeminiEngine();

  let screenshotBase64: string | undefined = undefined;
  if (options.includeScreenContext && window.electronAPI) {
    try {
      const captures = await window.electronAPI.captureScreens();
      if (captures && captures.length > 0) {
        screenshotBase64 = captures[0].dataUrl;
      }
    } catch (err) {
      console.warn('Failed to capture screen context:', err);
    }
  }

  const model = options.isHighReasoning ? settings.geminiModelPro : settings.geminiModelVoice;

  return await currentEngine.generateTurn({
    apiKey: settings.geminiApiKey,
    model,
    userPrompt: prompt,
    screenshotBase64,
    conversationHistory: options.conversationHistory,
    isHighReasoning: options.isHighReasoning,
  });
}
