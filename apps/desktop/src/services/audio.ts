/**
 * Original Audio Feedback & Voice Synthesis Engine
 * Provides original Web Audio API chimes and Speech Synthesis with zero paid key requirements.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Clean original chime for push-to-talk press
 */
export function playTalkStartChime(volume: number = 0.5) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch (err) {
    // Ignore audio context error
  }
}

/**
 * Gentle major triad chime on task or walkthrough completion
 */
export function playTaskCompleteChime(volume: number = 0.5) {
  try {
    const ctx = getAudioContext();
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.32);
    });
  } catch (err) {
    // Ignore
  }
}

/**
 * Friendly help request ping
 */
export function playHelpChime(volume: number = 0.5) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(659.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (err) {
    // Ignore
  }
}

/**
 * Spoken audio synthesizer with support for 130+ languages, rate & pitch
 */
export function speakText(
  text: string,
  options: {
    language?: string;
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
  } = {}
) {
  if (!('speechSynthesis' in window)) return;

  // Cancel any prior utterance immediately (allows instant barge-in)
  window.speechSynthesis.cancel();

  // Strip tags like [POINT:...] before speaking
  const cleanSpokenText = text
    .replace(/\[POINT:[^\]]+\]/g, '')
    .replace(/\[DRAW:[^\]]+\]/g, '')
    .replace(/\[SCENE3D:[\s\S]*?\]/g, '')
    .trim();

  if (!cleanSpokenText) return;

  const utterance = new SpeechSynthesisUtterance(cleanSpokenText);
  utterance.lang = options.language || 'en-US';
  utterance.rate = options.rate || 1.05;
  utterance.pitch = options.pitch || 1.0;

  if (options.onStart) utterance.onstart = options.onStart;
  if (options.onEnd) utterance.onend = options.onEnd;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
