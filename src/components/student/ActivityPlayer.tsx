import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { speechService } from '../../services/speechService';
import { Activity, ActivityStep, StepOption } from '../../types';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Lightbulb, 
  CheckCircle, 
  HelpCircle, 
  Sparkles, 
  PauseCircle, 
  RotateCcw,
  BookOpen,
  ChevronRight,
  Smile
} from 'lucide-react';

interface ActivityPlayerProps {
  activity: Activity;
  onBack: () => void;
  onFinish: () => void;
}

export const ActivityPlayer: React.FC<ActivityPlayerProps> = ({ activity, onBack, onFinish }) => {
  const { currentStudent, completeStudentActivity } = useAuth();
  const { preferences, fontSizeClassName } = useAccessibility();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showVocab, setShowVocab] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const step: ActivityStep = activity.steps[currentStepIndex] || activity.steps[0];
  const totalSteps = activity.steps.length;

  const handleSpeak = (text: string) => {
    speechService.speak(text);
  };

  const handleSelectOption = (opt: StepOption) => {
    setSelectedOptionId(opt.id);
    const isCorrect = opt.isCorrect ?? true;
    setFeedback({
      isCorrect,
      text: opt.feedbackText,
    });

    if (preferences.enableAudioNarrator) {
      speechService.speak(opt.feedbackText);
    }
  };

  const handleNextStep = () => {
    setSelectedOptionId(null);
    setFeedback(null);
    setShowHint(false);
    setShowVocab(false);

    if (currentStepIndex + 1 < totalSteps) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsCompleted(true);
      completeStudentActivity(activity.id, 5);
      if (preferences.enableAudioNarrator) {
        speechService.speak('Parabéns! Você concluiu esta atividade de administração com calma e dedicação!');
      }
    }
  };

  if (isPaused) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center bg-white rounded-3xl border border-blue-100 shadow-sm my-12">
        <div className="w-16 h-16 bg-[#DBEAFE] text-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <PauseCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#173B70] mb-2">Pausa Tranquila</h2>
        <p className="text-sm text-[#526176] mb-6 max-w-md mx-auto">
          Respire com calma, beba um copo de água e retome quando se sentir pronto. Sua atividade está salva exatamente onde você parou.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsPaused(false)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-colors"
          >
            Continuar Atividade
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
          >
            Voltar ao Meu Início
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-3xl border border-blue-100 shadow-sm my-8">
        <div className="w-20 h-20 bg-[#DDF7E8] text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#173B70] mb-2">
          Muito bem por continuar, {currentStudent?.preferredName}!
        </h2>
        <p className="text-sm text-[#526176] mb-6">
          Você completou todos os passos de "{activity.title}" e fortaleceu seus conhecimentos em Administração.
        </p>

        {/* Peaceful Progress Feedback */}
        <div className="p-4 rounded-2xl bg-[#F4F8FF] border border-blue-100 mb-6 flex items-center justify-around">
          <div className="text-center">
            <span className="text-xs text-[#526176] block">Estrelas de Esforço</span>
            <span className="text-xl font-bold text-[#2563EB] flex items-center justify-center gap-1">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              +5 Estrelas
            </span>
          </div>
          <div className="w-px h-8 bg-blue-100" />
          <div className="text-center">
            <span className="text-xs text-[#526176] block">Tempo Tranquilo</span>
            <span className="text-xl font-bold text-[#173B70]">
              {activity.estimatedMinutes} min
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onFinish}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base transition-colors shadow-xs"
        >
          Voltar para Minhas Atividades
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#526176] hover:text-[#173B70] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        {/* Visual Routine Progress Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#526176]">
            Passo {currentStepIndex + 1} de {totalSteps}
          </span>
          <div className="flex gap-1.5">
            {activity.steps.map((_, idx) => (
              <div
                key={idx}
                className={`w-6 h-2 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'bg-[#2563EB] w-8'
                    : idx < currentStepIndex
                    ? 'bg-emerald-400'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Pause Button */}
        <button
          type="button"
          onClick={() => setIsPaused(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-[#526176] hover:bg-slate-50 transition-colors"
          title="Fazer uma pausa tranquila"
        >
          <PauseCircle className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Pausar</span>
        </button>
      </div>

      {/* Main Activity Card */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Step Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wide block mb-1">
              {activity.topic} · {step.title}
            </span>
            <h1
              className={`font-bold text-[#173B70] tracking-tight leading-snug ${fontSizeClassName} ${
                preferences.highlightMainInstruction ? 'instruction-focus-glow p-2 rounded-xl bg-blue-50/40' : ''
              }`}
            >
              {step.mainInstruction}
            </h1>
          </div>

          {/* Audio Narrator Button for the instruction */}
          {preferences.enableAudioNarrator && (
            <button
              type="button"
              onClick={() => handleSpeak(step.mainInstruction + (step.supportText ? ' ' + step.supportText : ''))}
              className="p-3 rounded-2xl bg-[#DBEAFE] hover:bg-blue-200 text-[#2563EB] transition-colors shrink-0 shadow-xs"
              title="Ouvir esta pergunta em áudio"
              aria-label="Ouvir esta pergunta em áudio"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Support Context (if available and not hidden) */}
        {step.supportText && !preferences.hideSecondaryDetails && (
          <p className="text-sm text-[#526176] leading-relaxed bg-[#F4F8FF] p-3.5 rounded-2xl border border-blue-50">
            💡 {step.supportText}
          </p>
        )}

        {/* Optional Administration Vocabulary Card */}
        {step.vocabularyCard && (
          <div>
            <button
              type="button"
              onClick={() => setShowVocab(!showVocab)}
              className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1.5 mb-2"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {showVocab ? 'Ocultar mini-glossário' : `O que significa "${step.vocabularyCard.term}" em Administração?`}
              </span>
            </button>
            {showVocab && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold block text-sm">{step.vocabularyCard.term}</span>
                <p>{step.vocabularyCard.definition}</p>
                <p className="text-amber-800 italic">Exemplo prático: {step.vocabularyCard.example}</p>
              </div>
            )}
          </div>
        )}

        {/* Interactive Options Area */}
        <div className="space-y-3 pt-2">
          {step.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-[#2563EB] bg-[#DBEAFE]/30 text-[#173B70] shadow-xs'
                    : 'border-slate-200 hover:border-blue-200 bg-white text-slate-800'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1">
                  <span className={`block font-medium ${fontSizeClassName}`}>
                    {opt.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Gentle Feedback Box (Never Red or Aggressive) */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              feedback.isCorrect
                ? 'bg-[#DDF7E8] border-emerald-300 text-emerald-900'
                : 'bg-blue-50 border-blue-200 text-[#173B70]'
            }`}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              {feedback.isCorrect ? (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <Smile className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <span className="font-bold text-xs uppercase tracking-wide block mb-0.5">
                {feedback.isCorrect ? 'Muito bem!' : 'Vamos tentar de outro jeito?'}
              </span>
              <p className="text-sm font-medium leading-relaxed">{feedback.text}</p>
            </div>
          </div>
        )}

        {/* Hint Tool */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <div>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#526176] hover:text-[#2563EB] transition-colors"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>{showHint ? 'Ocultar dica' : 'Preciso de uma dica amiga'}</span>
            </button>
            {showHint && (
              <p className="text-xs text-[#526176] mt-2 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                💡 {step.hint}
              </p>
            )}
          </div>

          {/* Continue button appears once an option is picked */}
          {feedback && (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>{currentStepIndex + 1 === totalSteps ? 'Finalizar Atividade' : 'Próxima Etapa'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
