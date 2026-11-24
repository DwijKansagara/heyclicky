/**
 * HeyClicky Native Audio & Speech Engine (Windows Edition)
 * Powered by Google Gemini Native Audio & TTS (30 Natural Voices)
 * Supports 130+ languages, Web Audio PCM decoding, 120ms Bluetooth pre-roll,
 * and pleasant original system chimes.
 */

import { GEMINI_VOICES, GeminiVoiceMeta } from '@heyclicky/shared';
import { loadUserSettings } from './storage.js';

let audioCtx: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;
let isAudioPlaying = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass({ sampleRate: 24000 });
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Prepend 120ms of silence to prevent Bluetooth headphone first-syllable clipping
 */
function addBluetoothPreRoll(audioBuffer: AudioBuffer, ctx: AudioContext, preRollMs: number = 120): AudioBuffer {
  const preRollSamples = Math.floor((preRollMs / 1000) * audioBuffer.sampleRate);
  const totalLength = audioBuffer.length + preRollSamples;
  const buffered = ctx.createBuffer(
    audioBuffer.numberOfChannels,
    totalLength,
    audioBuffer.sampleRate
  );

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const sourceData = audioBuffer.getChannelData(channel);
    const targetData = buffered.getChannelData(channel);
    // targetData starts with zeroes (silence) up to preRollSamples
    targetData.set(sourceData, preRollSamples);
  }

  return buffered;
}

/**
 * Convert 16-bit Little-Endian Linear PCM buffer to Web Audio AudioBuffer
 */
function pcmToAudioBuffer(pcmBytes: Uint8Array, ctx: AudioContext, sampleRate: number = 24000): AudioBuffer {
  const sampleCount = Math.floor(pcmBytes.byteLength / 2);
  const audioBuffer = ctx.createBuffer(1, sampleCount, sampleRate);
  const channelData = audioBuffer.getChannelData(0);
  const dataView = new DataView(pcmBytes.buffer, pcmBytes.byteOffset, pcmBytes.byteLength);

  for (let i = 0; i < sampleCount; i++) {
    // Read 16-bit signed integer (-32768 to 32767) and normalize to -1.0 to 1.0
    const sample = dataView.getInt16(i * 2, true);
    channelData[i] = sample < 0 ? sample / 32768 : sample / 32767;
  }

  return audioBuffer;
}

/**
 * Generate speech using Gemini Native Audio / TTS
 */
export async function speakGeminiAudio(
  text: string,
  options: {
    voice?: string;
    model?: string;
    rate?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: any) => void;
  } = {}
): Promise<boolean> {
  const settings = await loadUserSettings();
  const apiKey = settings.geminiApiKey?.trim();
  const voiceName = options.voice || settings.geminiVoice || 'Puck';
  const modelName = options.model || settings.ttsModel || 'gemini-2.5-flash-preview-tts';
  const rate = options.rate ?? settings.speechRate ?? 1.0;

  // Clean tags like [POINT:...], [DRAW:...], [SCENE3D:...] before speaking
  const cleanText = text
    .replace(/\[POINT:[^\]]+\]/g, '')
    .replace(/\[DRAW:[^\]]+\]/g, '')
    .replace(/\[SCENE3D:[\s\S]*?\]/g, '')
    .trim();

  if (!cleanText) return false;

  stopSpeaking();

  // If no Gemini API key configured, use Web Speech fallback with visible warning
  if (!apiKey) {
    console.warn('[Voice Engine] No Gemini API Key set. Falling back to local SpeechSynthesis.');
    return speakLocalFallback(cleanText, options);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{
        role: 'user',
        parts: [{ text: cleanText }]
      }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName
            }
          }
        }
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[Voice Engine] Gemini TTS returned HTTP ${res.status}: ${errText}. Falling back to Web Speech.`);
      return speakLocalFallback(cleanText, options);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find((p: any) => p.inlineData);

    if (!audioPart?.inlineData?.data) {
      console.warn('[Voice Engine] No audio payload returned by Gemini. Using fallback.');
      return speakLocalFallback(cleanText, options);
    }

    const mimeType = audioPart.inlineData.mimeType || 'audio/x-pcm';
    const base64Data = audioPart.inlineData.data;
    const binaryStr = atob(base64Data);
    const pcmBytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      pcmBytes[i] = binaryStr.charCodeAt(i);
    }

    const ctx = getAudioContext();
    let audioBuffer: AudioBuffer;

    if (mimeType.includes('wav') || mimeType.includes('mp3') || mimeType.includes('ogg')) {
      audioBuffer = await ctx.decodeAudioData(pcmBytes.buffer);
    } else {
      // 24kHz raw PCM default
      audioBuffer = pcmToAudioBuffer(pcmBytes, ctx, 24000);
    }

    // Add 120ms silent pre-roll to prevent Bluetooth headphone initial syllable clipping
    const preparedBuffer = addBluetoothPreRoll(audioBuffer, ctx, 120);

    const source = ctx.createBufferSource();
    source.buffer = preparedBuffer;
    source.playbackRate.value = Math.max(0.5, Math.min(1.5, rate));

    const gainNode = ctx.createGain();
    gainNode.gain.value = settings.volume ?? 0.85;

    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    currentSourceNode = source;
    isAudioPlaying = true;
    options.onStart?.();

    source.onended = () => {
      isAudioPlaying = false;
      currentSourceNode = null;
      options.onEnd?.();
    };

    source.start(0);
    return true;
  } catch (err) {
    console.error('[Voice Engine Error]', err);
    options.onError?.(err);
    return speakLocalFallback(cleanText, options);
  }
}

/**
 * Fallback to local browser speech synthesis if Gemini TTS rate-limits or is offline
 */
function speakLocalFallback(
  text: string,
  options: {
    rate?: number;
    onStart?: () => void;
    onEnd?: () => void;
  }
): boolean {
  if (!('speechSynthesis' in window)) return false;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate || 1.0;
  if (options.onStart) utterance.onstart = options.onStart;
  if (options.onEnd) utterance.onend = options.onEnd;

  window.speechSynthesis.speak(utterance);
  return true;
}

/**
 * Universal stop speaking (stops both Web Audio & SpeechSynthesis immediately)
 */
export function stopSpeaking() {
  if (currentSourceNode) {
    try {
      currentSourceNode.stop();
      currentSourceNode.disconnect();
    } catch {
      // Ignore if already ended
    }
    currentSourceNode = null;
  }
  isAudioPlaying = false;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Tap-to-preview a specific voice from the 30 Gemini voices
 */
export async function previewVoice(voice: GeminiVoiceMeta): Promise<void> {
  stopSpeaking();
  await speakGeminiAudio(voice.sampleText, {
    voice: voice.id,
    rate: 1.0,
  });
}

/**
 * Soft, pleasant original Web Audio Chimes
 */

export function playTalkStartChime() {
  try {
    loadUserSettings().then((s) => {
      if (!s.chimesEnabled) return;
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(s.volume * 0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    });
  } catch {
    // Ignore audio initialization errors
  }
}

export function playTaskStartChime() {
  try {
    loadUserSettings().then((s) => {
      if (!s.chimesEnabled) return;
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(392, ctx.currentTime); // G4
      osc.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.12); // C5

      gain.gain.setValueAtTime(s.volume * 0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.17);
    });
  } catch {
    // Ignore
  }
}

export function playTaskCompleteChime() {
  try {
    loadUserSettings().then((s) => {
      if (!s.chimesEnabled) return;
      const ctx = getAudioContext();
      // Gentle warm triad C5, E5, G5
      const notes = [523.25, 659.25, 783.99];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const startTime = ctx.currentTime + idx * 0.07;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(s.volume * 0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.26);
      });
    });
  } catch {
    // Ignore
  }
}

export function playNeedsYouChime() {
  try {
    loadUserSettings().then((s) => {
      if (!s.chimesEnabled) return;
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.setValueAtTime(587.33, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(s.volume * 0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.24);
    });
  } catch {
    // Ignore
  }
}
