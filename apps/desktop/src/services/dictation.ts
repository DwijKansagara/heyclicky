import { sanitizeTerminalText } from '@heyclicky/shared';
import { loadUserSettings } from './storage.js';

export interface DictationState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
}

export class DictationService {
  private recognition: any = null;
  private isListening = false;
  private currentTranscript = '';

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    }
  }

  public async startDictation(
    onResult: (state: DictationState) => void,
    onError: (err: string) => void
  ) {
    if (!this.recognition) {
      onError('SpeechRecognition not supported in this environment');
      return;
    }

    const settings = await loadUserSettings();
    this.recognition.lang = settings.dictationLanguage || 'en-US';
    this.isListening = true;
    this.currentTranscript = '';

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let finalized = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalized += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (finalized) {
        this.currentTranscript += ' ' + finalized;
        this.currentTranscript = this.applyCustomDictionary(this.currentTranscript.trim(), settings.customDictionary);
      }

      onResult({
        isListening: this.isListening,
        transcript: this.currentTranscript,
        interimTranscript: interim,
      });
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error || 'Dictation recognition error');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onResult({
        isListening: false,
        transcript: this.currentTranscript,
        interimTranscript: '',
      });
    };

    try {
      this.recognition.start();
    } catch {
      // Already running
    }
  }

  public stopDictation(): string {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
    return this.currentTranscript;
  }

  /**
   * Applies custom dictionary words and preserves user terms
   */
  private applyCustomDictionary(text: string, customWords: string[]): string {
    let result = text;
    for (const word of customWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      result = result.replace(regex, word);
    }
    return result;
  }

  /**
   * Safe text injection preparing string for the target window context
   */
  public prepareTextForInsertion(text: string, isTerminalContext: boolean): string {
    return sanitizeTerminalText(text, isTerminalContext);
  }
}
