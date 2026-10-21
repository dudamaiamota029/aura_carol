/**
 * Serviço de síntese de voz (áudio) inclusivo e acessível para o Aura
 * Cadência suave, altura tranquila e velocidade adaptável para estudantes com TEA,
 * TDAH, dislexia e dificuldades de leitura.
 */

export type SpeechRate = 0.75 | 0.88 | 1.0 | 1.25;

type SpeechListener = (isSpeaking: boolean, rate: SpeechRate, currentText: string) => void;

class SpeechService {
  private isSpeakingState = false;
  private currentText = '';
  private rate: SpeechRate = 0.88;
  private listeners: Set<SpeechListener> = new Set();

  constructor() {
    const savedRate = localStorage.getItem('aura_speech_rate');
    if (savedRate) {
      const parsed = parseFloat(savedRate) as SpeechRate;
      if ([0.75, 0.88, 1.0, 1.25].includes(parsed)) {
        this.rate = parsed;
      }
    }
  }

  getRate(): SpeechRate {
    return this.rate;
  }

  setRate(newRate: SpeechRate) {
    this.rate = newRate;
    localStorage.setItem('aura_speech_rate', newRate.toString());
    this.notify();
  }

  subscribe(listener: SpeechListener): () => void {
    this.listeners.add(listener);
    listener(this.isSpeakingState, this.rate, this.currentText);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) =>
      listener(this.isSpeakingState, this.rate, this.currentText)
    );
  }

  speak(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      console.warn('Síntese de voz não suportada pelo navegador');
      return;
    }

    this.stop();

    // Limpeza de marcações markdown e quebras de linha para fala calma e fluida
    const cleanedText = text
      .replace(/[*_#`[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanedText) return;

    this.currentText = cleanedText;

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = 'pt-BR';
    utterance.rate = this.rate;
    utterance.pitch = 1.0;

    // Selecionar a melhor voz em português disponível no sistema
    const voices = window.speechSynthesis.getVoices();
    const ptVoice =
      voices.find((v) => v.lang === 'pt-BR' || v.lang.startsWith('pt')) ||
      voices.find((v) => v.name.toLowerCase().includes('brazil') || v.name.toLowerCase().includes('portuguese')) ||
      null;

    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onstart = () => {
      this.isSpeakingState = true;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.currentText = '';
      this.notify();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeakingState = false;
      this.currentText = '';
      this.notify();
    };

    window.speechSynthesis.speak(utterance);
  }

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeakingState = false;
      this.currentText = '';
      this.notify();
    }
  }

  toggle(text: string, onEnd?: () => void) {
    if (this.isSpeaking()) {
      this.stop();
    } else {
      this.speak(text, onEnd);
    }
  }

  isSpeaking(): boolean {
    return this.isSpeakingState || ('speechSynthesis' in window && window.speechSynthesis.speaking);
  }
}

export const speechService = new SpeechService();
