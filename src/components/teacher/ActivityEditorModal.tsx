import React, { useState } from 'react';
import { Activity, ActivityStep, StepOption } from '../../types';
import { AiService } from '../../services/aiService';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle, 
  X, 
  BookOpen, 
  RefreshCw,
  Lightbulb,
  Layers
} from 'lucide-react';

interface ActivityEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
  activityToEdit?: Activity | null;
}

export const ActivityEditorModal: React.FC<ActivityEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  activityToEdit,
}) => {
  const [title, setTitle] = useState(activityToEdit?.title || '');
  const [topic, setTopic] = useState<Activity['topic']>(activityToEdit?.topic || 'Rotina Escolar & Organização');
  const [discipline, setDiscipline] = useState(activityToEdit?.discipline || 'Administração & Práticas Inclusivas');
  const [description, setDescription] = useState(activityToEdit?.description || '');
  const [estimatedMinutes, setEstimatedMinutes] = useState(activityToEdit?.estimatedMinutes || 6);
  const [targetSupportLevel, setTargetSupportLevel] = useState<'1' | '2' | 'ambos'>(activityToEdit?.targetSupportLevel || 'ambos');

  // Steps
  const [steps, setSteps] = useState<ActivityStep[]>(
    activityToEdit?.steps || [
      {
        stepNumber: 1,
        title: 'Etapa 1: Compreensão Básica',
        mainInstruction: 'Qual é o papel principal de quem administra um negócio?',
        supportText: 'Pense em quem organiza os materiais e ajuda a equipe a trabalhar em harmonia.',
        type: 'multipla_escolha',
        hint: 'Administrar envolve planejar antes de executar.',
        vocabularyCard: {
          term: 'Gestão',
          definition: 'Ato de organizar recursos para atingir um objetivo com segurança.',
          example: 'Organizar os horários das aulas e as salas.',
        },
        options: [
          {
            id: 'opt-1',
            label: 'Planejar os recursos, organizar as tarefas e apoiar os colegas',
            isCorrect: true,
            feedbackText: 'Muito bem! Você definiu a essência da boa administração.',
          },
          {
            id: 'opt-2',
            label: 'Trabalhar sozinho sem conversar com ninguém',
            isCorrect: false,
            feedbackText: 'Administrar é um trabalho coletivo. Vamos tentar novamente?',
          },
        ],
      },
    ]
  );

  // AI Adaptation Assistant state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);

  if (!isOpen) return null;

  const handleAiAdaptation = async () => {
    if (!title.trim()) return;
    setIsAiLoading(true);

    try {
      const result = await AiService.adaptAdministrationActivity({
        activityTitle: title,
        originalInstructions: steps[0]?.mainInstruction || description,
        topic,
        studentLevel: targetSupportLevel === '2' ? '2' : '1',
      });
      setAiSuggestion(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyAiSuggestion = () => {
    if (!aiSuggestion) return;
    const updatedSteps: ActivityStep[] = [...steps];
    if (updatedSteps[0]) {
      updatedSteps[0].mainInstruction = aiSuggestion.simplifiedInstructions || updatedSteps[0].mainInstruction;
      if (aiSuggestion.concreteExample) {
        updatedSteps[0].supportText = aiSuggestion.concreteExample;
      }
      if (aiSuggestion.vocabularySupport && aiSuggestion.vocabularySupport[0]) {
        updatedSteps[0].vocabularyCard = {
          term: aiSuggestion.vocabularySupport[0].term,
          definition: aiSuggestion.vocabularySupport[0].definition,
          example: aiSuggestion.concreteExample || 'Aplicação no dia a dia.',
        };
      }
    }
    setSteps(updatedSteps);
    setAiSuggestion(null);
  };

  const handleAddStep = () => {
    const newStepNum = steps.length + 1;
    setSteps([
      ...steps,
      {
        stepNumber: newStepNum,
        title: `Etapa ${newStepNum}: Novo Exercício`,
        mainInstruction: 'Instrução clara e objetiva para esta etapa de administração:',
        supportText: 'Dica ou exemplo prático do cotidiano.',
        type: 'multipla_escolha',
        hint: 'Lembre-se do passo anterior.',
        options: [
          {
            id: `opt-${newStepNum}-a`,
            label: 'Primeira alternativa',
            isCorrect: true,
            feedbackText: 'Excelente raciocínio!',
          },
          {
            id: `opt-${newStepNum}-b`,
            label: 'Segunda alternativa',
            isCorrect: false,
            feedbackText: 'Vamos revisar com calma?',
          },
        ],
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newActivity: Activity = {
      id: activityToEdit?.id || `act-adm-${Date.now()}`,
      title: title.trim(),
      topic,
      discipline,
      description: description.trim(),
      targetSupportLevel,
      estimatedMinutes: Number(estimatedMinutes) || 8,
      adaptiveAiAssistanceEnabled: true,
      createdByTeacherId: activityToEdit?.createdByTeacherId || 'teacher-prof-marina',
      createdAt: activityToEdit?.createdAt || new Date().toISOString(),
      steps,
    };

    onSave(newActivity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F4F8FF] border-b border-blue-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#173B70]">
                {activityToEdit ? 'Editar Atividade de Administração' : 'Criar Nova Atividade de Administração'}
              </h2>
              <span className="text-[11px] text-[#526176]">
                Editor adaptativo com divisão em etapas e apoio de IA inclusiva
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* AI Pedagogical Adapter Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span className="text-xs font-bold text-[#173B70]">
                  Assistente de IA para Adaptação TEA & TDAH
                </span>
              </div>
              <button
                type="button"
                onClick={handleAiAdaptation}
                disabled={isAiLoading || !title}
                className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Adaptando com Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sugerir Adaptação de Linguagem</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#526176]">
              A IA reformula o conteúdo em linguagem concreta, divide em etapas pequenas e sugere exemplos do cotidiano de empresas para estudantes neurodivergentes.
            </p>

            {aiSuggestion && (
              <div className="mt-3 p-3.5 rounded-xl bg-white border border-blue-200 text-xs text-slate-800 space-y-2">
                <span className="font-bold text-[#2563EB] block">Adaptação Sugerida:</span>
                <p><strong>Instrução:</strong> {aiSuggestion.simplifiedInstructions}</p>
                {aiSuggestion.concreteExample && (
                  <p><strong>Exemplo Concreto:</strong> {aiSuggestion.concreteExample}</p>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAiSuggestion(null)}
                    className="px-3 py-1 text-slate-500 text-xs hover:text-slate-800"
                  >
                    Descartar
                  </button>
                  <button
                    type="button"
                    onClick={applyAiSuggestion}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Aplicar na Atividade
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dados Gerais da Atividade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#173B70] block mb-1">
                Título da Atividade *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Organização e Recursos na Prática"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#173B70] block mb-1">
                Eixo Temático do Projeto
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
              >
                <option value="Rotina Escolar & Organização">Rotina Escolar & Organização</option>
                <option value="Trabalho em Equipe & Empatia">Trabalho em Equipe & Empatia</option>
                <option value="Autonomia & Pequenas Metas">Autonomia & Pequenas Metas</option>
                <option value="Educação Financeira do Dia a Dia">Educação Financeira do Dia a Dia</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#173B70] block mb-1">
                Tempo Estimado (Minutos)
              </label>
              <input
                type="number"
                min={3}
                max={30}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#173B70] block mb-1">
                Nível de Suporte Alvo
              </label>
              <select
                value={targetSupportLevel}
                onChange={(e) => setTargetSupportLevel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
              >
                <option value="ambos">Ambos (Nível 1 e Nível 2)</option>
                <option value="1">Nível 1 (Autonomia Guiada)</option>
                <option value="2">Nível 2 (Etapas Mais Curtas)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#173B70] block mb-1">
              Descrição Pedagógica
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="O que o aluno aprenderá nesta atividade de administração..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Steps Editor */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#173B70] uppercase tracking-wide flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#2563EB]" />
                Etapas da Atividade ({steps.length})
              </h3>
              <button
                type="button"
                onClick={handleAddStep}
                className="flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-blue-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Nova Etapa</span>
              </button>
            </div>

            {steps.map((st, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-blue-100 bg-[#F4F8FF]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#173B70]">
                    Etapa {idx + 1}: {st.title}
                  </span>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSteps(steps.filter((_, i) => i !== idx))}
                      className="text-xs text-red-500 hover:text-red-700"
                      title="Remover esta etapa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#173B70] block mb-0.5">
                    Instrução Principal (Destaque para o aluno)
                  </label>
                  <input
                    type="text"
                    value={st.mainInstruction}
                    onChange={(e) => {
                      const updated = [...steps];
                      updated[idx].mainInstruction = e.target.value;
                      setSteps(updated);
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#173B70] block mb-0.5">
                    Dica Amiga (Disponível quando o aluno solicitar)
                  </label>
                  <input
                    type="text"
                    value={st.hint}
                    onChange={(e) => {
                      const updated = [...steps];
                      updated[idx].hint = e.target.value;
                      setSteps(updated);
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              Salvar Atividade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
