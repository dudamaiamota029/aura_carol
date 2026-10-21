import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';
import { AiService } from '../../services/aiService';
import { 
  BarChart2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Heart, 
  Clock, 
  Brain, 
  Lightbulb,
  RefreshCw,
  Eye,
  Type
} from 'lucide-react';

export const PedagogicalReports: React.FC = () => {
  const { students, activities } = useAuth();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [aiTips, setAiTips] = useState<string[] | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleFetchAiTips = async () => {
    if (!selectedStudent) return;
    setIsLoadingAi(true);
    try {
      const response = await AiService.getPedagogicalRecommendations({
        studentName: selectedStudent.preferredName,
        attempts: 2,
        completedCount: selectedStudent.completedActivityIds.length,
        struggleTopic: selectedStudent.needsPedagogicalSupport ? selectedStudent.supportReason : 'Planejamento e Orçamento',
      });
      setAiTips(response.recommendations);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  if (!selectedStudent) {
    return <div className="p-8 text-center text-slate-500">Nenhum aluno cadastrado para exibir relatórios.</div>;
  }

  const completedActivitiesList = activities.filter((a) =>
    selectedStudent.completedActivityIds.includes(a.id)
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Selector & Header */}
      <div className="bg-white rounded-3xl border border-blue-100 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wide block mb-1">
            Acompanhamento Individual de Aprendizagem
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#173B70]">
            Relatório de Desenvolvimento em Administração
          </h1>
          <p className="text-xs text-[#526176] mt-0.5">
            Métricas respeitosas com foco em habilidades, autonomia e preferências de apoio
          </p>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#173B70] whitespace-nowrap">
            Estudante:
          </label>
          <select
            value={selectedStudent.id}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              setAiTips(null);
            }}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-[#173B70] bg-[#F4F8FF] focus:outline-none focus:border-[#2563EB]"
          >
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.schoolClass})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Student Overview & Support Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-5 border border-blue-100 flex items-center gap-4">
          <img
            src={selectedStudent.avatarUrl}
            alt={selectedStudent.name}
            className="w-14 h-14 rounded-full bg-[#DBEAFE]/50 shrink-0"
          />
          <div>
            <h2 className="text-sm font-bold text-[#173B70]">{selectedStudent.name}</h2>
            <span className="text-xs text-[#526176] block">
              Tratamento: "{selectedStudent.preferredName}" · Matrícula: {selectedStudent.registrationNumber}
            </span>
            <span className="inline-block mt-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              Suporte Nível {selectedStudent.supportLevel}
            </span>
          </div>
        </div>

        {/* Accessibility Preferences Active */}
        <div className="bg-white rounded-2xl p-5 border border-blue-100 space-y-1">
          <span className="text-xs font-bold text-[#173B70] flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#2563EB]" />
            Acomodações Utilizadas
          </span>
          <div className="text-xs text-[#526176] space-y-0.5 pt-1">
            <p>· Fonte preferida: <strong className="capitalize">{selectedStudent.preferences.fontChoice}</strong></p>
            <p>· Tamanho: <strong>{selectedStudent.preferences.fontSize.toUpperCase()}</strong></p>
            <p>· Áudio-narrador: <strong>{selectedStudent.preferences.enableAudioNarrator ? 'Ativo' : 'Desativado'}</strong></p>
          </div>
        </div>

        {/* Support Alert (if needed) */}
        <div className={`rounded-2xl p-5 border ${
          selectedStudent.needsPedagogicalSupport
            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            {selectedStudent.needsPedagogicalSupport ? (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span className="text-xs font-bold">
              {selectedStudent.needsPedagogicalSupport ? 'Atenção Pedagógica Sugerida' : 'Evolução Tranquila e Equilibrada'}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed">
            {selectedStudent.needsPedagogicalSupport
              ? selectedStudent.supportReason || 'Observar se o aluno precisa de enunciados mais curtos ou pausas sensoriais.'
              : 'O estudante tem concluído as atividades com autonomia e serenidade.'}
          </p>
        </div>
      </div>

      {/* Skill Mastery in Inclusive Development */}
      <div className="bg-white rounded-3xl border border-blue-100 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#173B70]">
            Desenvolvimento de Habilidades & Autonomia
          </h2>
          <p className="text-xs text-[#526176]">
            Acompanhamento das competências trabalhadas nas atividades pedagógicas de Administração
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Rotina & Organização', val: selectedStudent.skillMastery.organizacaoRotina, color: 'bg-blue-600' },
            { label: 'Trabalho em Equipe', val: selectedStudent.skillMastery.trabalhoEquipe, color: 'bg-indigo-600' },
            { label: 'Autonomia & Metas', val: selectedStudent.skillMastery.autonomiaMetas, color: 'bg-sky-600' },
            { label: 'Comunicação Empática', val: selectedStudent.skillMastery.comunicacaoEmpatica, color: 'bg-emerald-600' },
            { label: 'Finanças do Cotidiano', val: selectedStudent.skillMastery.financasCotidiano, color: 'bg-amber-600' },
          ].map((skill, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[#F4F8FF] border border-blue-50 space-y-2">
              <span className="text-xs font-semibold text-[#173B70] block truncate">
                {skill.label}
              </span>
              <div className="text-xl font-bold text-[#173B70] tabular-nums">
                {skill.val}%
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${skill.color}`}
                  style={{ width: `${skill.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Pedagogical Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-3xl border border-blue-200 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#173B70]">
                Recomendações Pedagógicas Explicáveis (Agente IA)
              </h2>
              <span className="text-xs text-[#526176]">
                Sugestões consultivas baseadas nos registros do estudante para apoiar a decisão docente
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFetchAiTips}
            disabled={isLoadingAi}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {isLoadingAi ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Consultando IA...</span>
              </>
            ) : (
              <>
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Gerar Novas Orientações</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {(aiTips || [
            'Manter uma instrução focal por tela para evitar sobrecarga de atenção.',
            'Reforçar o uso da letra bastão e áudio nos tópicos de matemática financeira e custos.',
            'Oferecer pausas voluntárias de 3 a 5 minutos a cada atividade completada.',
            'Utilizar exemplos concretos de rotina escolar para fixar os pilares de Planejar e Organizar.',
          ]).map((tip, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white border border-blue-100 flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                {idx + 1}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
