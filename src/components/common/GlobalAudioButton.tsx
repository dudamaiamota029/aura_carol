import React, { useState, useEffect } from 'react';
import { speechService } from '../../services/speechService';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface GlobalAudioButtonProps {
  customText?: string;
  label?: string;
  variant?: 'header' | 'floating' | 'banner' | 'card';
}

export const GlobalAudioButton: React.FC<GlobalAudioButtonProps> = ({
  customText,
  label = 'Ouvir',
  variant = 'header',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = speechService.subscribe((speaking) => {
      setIsPlaying(speaking);
    });
    return () => unsubscribe();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlaying) {
      speechService.stop();
      return;
    }

    // Determine what to read:
    // 1. If text is currently selected by the user on screen, read the selection!
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      speechService.speak(selection);
      return;
    }

    // 2. If customText was passed as prop, read it
    if (customText) {
      speechService.speak(customText);
      return;
    }

    // 3. Otherwise extract main text from current main content
    const mainEl = document.querySelector('main');
    if (mainEl) {
      const headings = Array.from(mainEl.querySelectorAll('h1, h2, p, button'))
        .map((el) => (el as HTMLElement).innerText.trim())
        .filter((t) => t.length > 2)
        .slice(0, 10)
        .join('. ');

      speechService.speak(headings || 'Bem-vindo ao Aura. Plataforma educacional adaptativa e inclusiva.');
    } else {
      speechService.speak('Bem-vindo ao Aura. Plataforma educacional adaptativa e inclusiva.');
    }
  };

  if (variant === 'banner') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95 ${
          isPlaying
            ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-200 animate-pulse'
            : 'bg-white text-[#173B70] hover:bg-blue-50 border border-blue-200'
        }`}
        title={isPlaying ? 'Clique para parar o áudio' : 'Ouvir este conteúdo em voz alta'}
        aria-label={isPlaying ? 'Parar leitura em áudio' : 'Ouvir este conteúdo em áudio'}
      >
        {isPlaying ? (
          <>
            <VolumeX className="w-4 h-4 text-amber-900" />
            <span>Pausar Áudio</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-[#2563EB]" />
            <span>{label}</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`p-2 rounded-xl transition-all active:scale-90 flex items-center justify-center shrink-0 ${
          isPlaying
            ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
            : 'bg-blue-50 hover:bg-blue-100 text-[#2563EB]'
        }`}
        title={isPlaying ? 'Parar áudio' : 'Ouvir em áudio'}
        aria-label="Ouvir este item em voz alta"
      >
        {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    );
  }

  // Default: Header button
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap active:scale-95 ${
        isPlaying
          ? 'bg-amber-400 text-amber-950 border-amber-500 font-bold shadow-xs'
          : 'bg-[#DBEAFE]/80 hover:bg-[#DBEAFE] text-[#173B70] border-blue-200'
      }`}
      title={isPlaying ? 'Clique para parar a leitura em áudio' : 'Clique para ouvir o texto da tela em voz alta'}
      aria-label={isPlaying ? 'Parar leitura em áudio' : 'Ouvir texto da página em voz alta'}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-amber-950 shrink-0" />
          <span>Parar Áudio</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
          <span className="hidden sm:inline">Ouvir Página</span>
          <span className="sm:hidden">Ouvir</span>
        </>
      )}
    </button>
  );
};
