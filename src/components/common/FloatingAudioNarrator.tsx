import React, { useState, useEffect } from 'react';
import { speechService, SpeechRate } from '../../services/speechService';
import { Volume2, VolumeX, Sparkles, Sliders, ChevronDown, ChevronUp, Play, Pause, Bookmark } from 'lucide-react';

export const FloatingAudioNarrator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRate, setCurrentRate] = useState<SpeechRate>(speechService.getRate());
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    const unsubscribe = speechService.subscribe((speaking, rate) => {
      setIsPlaying(speaking);
      setCurrentRate(rate);
    });

    const checkSelection = () => {
      const sel = window.getSelection()?.toString().trim();
      setHasSelection(Boolean(sel && sel.length > 0));
    };

    document.addEventListener('selectionchange', checkSelection);

    // Atalho de teclado acessível: Alt + A para ler/pausar
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        handleMainAction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubscribe();
      document.removeEventListener('selectionchange', checkSelection);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]);

  const readSelection = () => {
    const sel = window.getSelection()?.toString().trim();
    if (sel) {
      speechService.speak(sel);
    }
  };

  const readWholeScreen = () => {
    const mainEl = document.querySelector('main');
    if (!mainEl) {
      speechService.speak('Aura. Plataforma educacional adaptativa e inclusiva.');
      return;
    }

    // Extrair textos legíveis em ordem natural
    const elements = Array.from(mainEl.querySelectorAll('h1, h2, h3, p, [data-readable]'));
    const textPieces = elements
      .map((el) => (el as HTMLElement).innerText.trim())
      .filter((t) => t.length > 2);

    const fullText = textPieces.slice(0, 15).join('. ');
    speechService.speak(fullText || 'Página do Aura carregada.');
  };

  const handleMainAction = () => {
    if (isPlaying) {
      speechService.stop();
      return;
    }

    const sel = window.getSelection()?.toString().trim();
    if (sel) {
      speechService.speak(sel);
    } else {
      readWholeScreen();
    }
  };

  const handleRateChange = (rate: SpeechRate) => {
    speechService.setRate(rate);
    setCurrentRate(rate);
  };

  return (
    <aside
      aria-label="Assistente de Leitura em Áudio"
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2"
    >
      {/* Menu expandido de opções de leitura */}
      {isExpanded && (
        <div className="bg-white rounded-2xl border border-blue-200 shadow-xl p-4 w-72 space-y-3 mb-1 animate-in fade-in slide-in-from-bottom-2 text-[#173B70]">
          <div className="flex items-center justify-between border-b border-blue-100 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center">
                <Volume2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold">Leitor Acessível em Áudio</span>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-[#526176] hover:text-[#173B70] text-xs p-1"
              aria-label="Fechar configurações de áudio"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-[#526176] leading-relaxed">
            Feito para pessoas com dificuldade de leitura, TEA ou TDAH. Selecione qualquer texto com o mouse ou ouça a tela toda.
          </p>

          {/* Botões de Ação Rápida */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={readWholeScreen}
              className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-semibold text-xs text-left flex items-center justify-between transition-colors"
            >
              <span>Ouvir toda a página</span>
              <Play className="w-3.5 h-3.5" />
            </button>

            {hasSelection && (
              <button
                type="button"
                onClick={readSelection}
                className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs text-left flex items-center justify-between transition-colors"
              >
                <span>Ouvir texto selecionado</span>
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controle de Velocidade */}
          <div className="pt-1">
            <div className="text-[11px] font-bold text-[#526176] mb-1.5 flex items-center gap-1">
              <Sliders className="w-3 h-3" />
              <span>Velocidade da voz:</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-medium">
              {[
                { label: '0.75x Calmo', val: 0.75 as SpeechRate },
                { label: '1.0x Normal', val: 1.0 as SpeechRate },
                { label: '1.25x Rápido', val: 1.25 as SpeechRate },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => handleRateChange(item.val)}
                  className={`py-1.5 px-1 rounded-lg text-center text-[10px] sm:text-xs font-bold transition-all ${
                    currentRate === item.val
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-[#173B70]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center pt-1">
            Atalho: <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-mono">Alt + A</kbd>
          </div>
        </div>
      )}

      {/* Botão Flutuante Principal */}
      <div className="flex items-center gap-1.5 bg-white p-1 rounded-full shadow-lg border-2 border-blue-200 hover:border-[#2563EB] transition-all">
        <button
          type="button"
          onClick={handleMainAction}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all active:scale-95 ${
            isPlaying
              ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-md ring-2 ring-amber-300'
              : 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm'
          }`}
          aria-label={isPlaying ? 'Pausar leitura em áudio' : 'Ouvir texto em áudio'}
          title={isPlaying ? 'Pausar narração em áudio' : 'Clique para ouvir o texto desta tela'}
        >
          {isPlaying ? (
            <>
              <VolumeX className="w-4 h-4 text-amber-950 animate-pulse" />
              <span>Pausar Áudio</span>
              <span className="flex items-center gap-0.5 ml-1">
                <span className="w-1 h-3 bg-amber-950 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1 h-4 bg-amber-950 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1 h-2 bg-amber-950 rounded-full animate-bounce"></span>
              </span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>Ouvir Texto</span>
            </>
          )}
        </button>

        {/* Botão de abrir configurações de velocidade */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2.5 rounded-full text-[#173B70] hover:bg-blue-50 transition-colors"
          title="Opções de velocidade e leitura de seleção"
          aria-label="Abrir opções de leitura em áudio"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#2563EB]" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[#526176]" />
          )}
        </button>
      </div>
    </aside>
  );
};
