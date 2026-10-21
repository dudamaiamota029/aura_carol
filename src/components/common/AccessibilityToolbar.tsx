import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';
import { FontChoice, FontSizeChoice, LineHeightChoice, LetterSpacingChoice } from '../../types';
import { 
  Type, 
  Volume2, 
  VolumeX, 
  Eye, 
  Sun, 
  Moon, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  Check, 
  X,
  Sliders,
  RotateCcw
} from 'lucide-react';

interface AccessibilityToolbarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({ isOpen, onClose }) => {
  const { preferences, updatePreferences, resetToDefaults } = useAccessibility();
  const { currentStudent, updateCurrentStudentPreferences } = useAuth();

  if (!isOpen) return null;

  const handleFontSelect = (font: FontChoice) => {
    updatePreferences({ fontChoice: font });
    if (currentStudent) {
      updateCurrentStudentPreferences({ fontChoice: font });
    }
  };

  const handleFontSizeChange = (size: FontSizeChoice) => {
    updatePreferences({ fontSize: size });
    if (currentStudent) {
      updateCurrentStudentPreferences({ fontSize: size });
    }
  };

  const handleLetterSpacingChange = (spacing: LetterSpacingChoice) => {
    updatePreferences({ letterSpacing: spacing });
    if (currentStudent) {
      updateCurrentStudentPreferences({ letterSpacing: spacing });
    }
  };

  const handleLineHeightChange = (height: LineHeightChoice) => {
    updatePreferences({ lineHeight: height });
    if (currentStudent) {
      updateCurrentStudentPreferences({ lineHeight: height });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
      role="dialog"
      aria-labelledby="accessibility-modal-title"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-50 bg-[#F4F8FF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h2 id="accessibility-modal-title" className="text-lg font-bold text-[#173B70]">
                Escolher como quero ler
              </h2>
              <p className="text-xs text-[#526176]">
                Personalize letras, tamanhos e recursos sensoriais ao seu gosto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white transition-colors"
            aria-label="Fechar painel de acessibilidade"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 1. Escolha da Fonte (Cursiva vs Bastão vs Sem Serifa) */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#173B70] block">
              1. Estilo da Letra (Muda toda a plataforma instantaneamente)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Opção Cursiva */}
              <button
                type="button"
                onClick={() => handleFontSelect('cursiva')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  preferences.fontChoice === 'cursiva'
                    ? 'border-[#2563EB] bg-[#DBEAFE]/30 text-[#173B70] shadow-xs'
                    : 'border-slate-200 hover:border-blue-200 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-blue-700">Cursiva Escolar</span>
                  {preferences.fontChoice === 'cursiva' && (
                    <Check className="w-4 h-4 text-[#2563EB]" />
                  )}
                </div>
                <div className="font-cursiva text-xl text-slate-900 mt-1">
                  Aprender Administração
                </div>
                <p className="text-xs text-[#526176] mt-1 font-sans">
                  Letras arredondadas e contínuas
                </p>
              </button>

              {/* Opção Bastão / Forma */}
              <button
                type="button"
                onClick={() => handleFontSelect('bastao')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  preferences.fontChoice === 'bastao'
                    ? 'border-[#2563EB] bg-[#DBEAFE]/30 text-[#173B70] shadow-xs'
                    : 'border-slate-200 hover:border-blue-200 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-blue-700">Letra Bastão</span>
                  {preferences.fontChoice === 'bastao' && (
                    <Check className="w-4 h-4 text-[#2563EB]" />
                  )}
                </div>
                <div className="font-bastao text-sm text-slate-900 tracking-wider mt-1 font-bold">
                  APRENDER ADMINISTRAÇÃO
                </div>
                <p className="text-xs text-[#526176] mt-1 font-sans">
                  Letras de forma bem separadas
                </p>
              </button>

              {/* Opção Sem Serifa de Alta Legibilidade */}
              <button
                type="button"
                onClick={() => handleFontSelect('legivel')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  preferences.fontChoice === 'legivel'
                    ? 'border-[#2563EB] bg-[#DBEAFE]/30 text-[#173B70] shadow-xs'
                    : 'border-slate-200 hover:border-blue-200 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-blue-700">Alta Legibilidade</span>
                  {preferences.fontChoice === 'legivel' && (
                    <Check className="w-4 h-4 text-[#2563EB]" />
                  )}
                </div>
                <div className="font-legivel text-base text-slate-900 font-medium mt-1">
                  Aprender Administração
                </div>
                <p className="text-xs text-[#526176] mt-1 font-sans">
                  Sem serifa, limpa e moderna
                </p>
              </button>
            </div>
          </div>

          {/* 2. Tamanho da Letra */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#173B70] block">
              2. Tamanho do Texto
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'sm', label: 'Pequeno', icon: 'A' },
                { id: 'md', label: 'Médio', icon: 'A' },
                { id: 'lg', label: 'Grande', icon: 'A+' },
                { id: 'xl', label: 'Extra', icon: 'A++' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleFontSizeChange(s.id as FontSizeChoice)}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                    preferences.fontSize === s.id
                      ? 'border-[#2563EB] bg-[#2563EB] text-white font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-sm font-semibold">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Espaçamento entre Letras e Linhas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#173B70] block mb-2">
                Espaçamento entre Letras
              </label>
              <div className="flex rounded-xl p-1 bg-slate-100 border border-slate-200">
                {(['normal', 'wide', 'wider'] as LetterSpacingChoice[]).map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => handleLetterSpacingChange(sp)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                      preferences.letterSpacing === sp
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sp === 'normal' ? 'Padrão' : sp === 'wide' ? 'Amplo' : 'Muito Amplo'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#173B70] block mb-2">
                Espaçamento entre Linhas
              </label>
              <div className="flex rounded-xl p-1 bg-slate-100 border border-slate-200">
                {(['normal', 'relaxed', 'loose'] as LineHeightChoice[]).map((lh) => (
                  <button
                    key={lh}
                    type="button"
                    onClick={() => handleLineHeightChange(lh)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                      preferences.lineHeight === lh
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lh === 'normal' ? 'Normal' : lh === 'relaxed' ? 'Relaxado' : 'Espaçoso'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Conforto Sensorial e Foco (TEA e TDAH) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-sm font-semibold text-[#173B70] block">
              3. Conforto Sensorial & Recursos de Apoio
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Destaque da Instrução Principal */}
              <button
                type="button"
                onClick={() => updatePreferences({ highlightMainInstruction: !preferences.highlightMainInstruction })}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  preferences.highlightMainInstruction
                    ? 'border-[#2563EB] bg-[#DBEAFE]/20 text-[#173B70]'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <div>
                  <span className="text-xs font-semibold block">Destacar Instrução Principal</span>
                  <span className="text-[11px] text-[#526176]">Facilita o foco na pergunta</span>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center ${preferences.highlightMainInstruction ? 'bg-[#2563EB] text-white' : 'border border-slate-300'}`}>
                  {preferences.highlightMainInstruction && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>

              {/* Reduzir Animações */}
              <button
                type="button"
                onClick={() => updatePreferences({ reduceMotion: !preferences.reduceMotion })}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  preferences.reduceMotion
                    ? 'border-[#2563EB] bg-[#DBEAFE]/20 text-[#173B70]'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <div>
                  <span className="text-xs font-semibold block">Reduzir Movimentos</span>
                  <span className="text-[11px] text-[#526176]">Evita transições e efeitos bruscos</span>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center ${preferences.reduceMotion ? 'bg-[#2563EB] text-white' : 'border border-slate-300'}`}>
                  {preferences.reduceMotion && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>

              {/* Alto Contraste */}
              <button
                type="button"
                onClick={() => updatePreferences({ highContrast: !preferences.highContrast })}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  preferences.highContrast
                    ? 'border-[#2563EB] bg-[#DBEAFE]/20 text-[#173B70]'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <div>
                  <span className="text-xs font-semibold block">Modo Noturno / Alto Contraste</span>
                  <span className="text-[11px] text-[#526176]">Fundo escuro para conforto visual</span>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center ${preferences.highContrast ? 'bg-[#2563EB] text-white' : 'border border-slate-300'}`}>
                  {preferences.highContrast && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>

              {/* Áudio Narrador Automático */}
              <button
                type="button"
                onClick={() => updatePreferences({ enableAudioNarrator: !preferences.enableAudioNarrator })}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  preferences.enableAudioNarrator
                    ? 'border-[#2563EB] bg-[#DBEAFE]/20 text-[#173B70]'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <div>
                  <span className="text-xs font-semibold block">Botão de Ouvir Enunciados</span>
                  <span className="text-[11px] text-[#526176]">Voz acolhedora e pausada</span>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center ${preferences.enableAudioNarrator ? 'bg-[#2563EB] text-white' : 'border border-slate-300'}`}>
                  {preferences.enableAudioNarrator && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar padrão</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
          >
            Confirmar e Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
