import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Activity } from '../../types';
import { ActivityPlayer } from './ActivityPlayer';
import { StudentAchievements } from './StudentAchievements';
import { 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Type, 
  ArrowRight,
  Smile,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';

interface StudentHomeProps {
  currentTab: string;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ currentTab }) => {
  const { currentStudent, activities } = useAuth();
  const { preferences, fontSizeClassName } = useAccessibility();

  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'ongoing' | 'done'>('all');

  if (activeActivity) {
    return (
      <ActivityPlayer
        activity={activeActivity}
        onBack={() => setActiveActivity(null)}
        onFinish={() => setActiveActivity(null)}
      />
    );
  }

  if (currentTab === 'achievements') {
    return <StudentAchievements />;
  }

  const completedIds = currentStudent?.completedActivityIds || [];
  const completedList = activities.filter((a) => completedIds.includes(a.id));
  const ongoingList = activities.filter((a) => !completedIds.includes(a.id));

  // Determine the next activity to resume
  const nextActivity = ongoingList[0] || activities[0];

  const displayedActivities = (() => {
    if (filterType === 'ongoing') return ongoingList;
    if (filterType === 'done') return completedList;
    return activities;
  })();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-[#173B70] rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-medium text-blue-100 backdrop-blur-xs">
            <Smile className="w-3.5 h-3.5" />
            <span>Aprender do seu jeito</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Olá, {currentStudent?.preferredName || 'Estudante'}!
          </h1>
          <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
            Um espaço onde cada aluno aprende no seu próprio ritmo. Vamos continuar as atividades preparadas com carinho pelo seu professor?
          </p>
        </div>

        {/* Quick Resume CTA */}
        {nextActivity && (
          <button
            type="button"
            onClick={() => setActiveActivity(nextActivity)}
            className="w-full md:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-blue-50 text-[#173B70] font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-md transition-all active:scale-95 shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            </div>
            <div className="text-left">
              <span className="text-[11px] text-[#526176] block font-medium">Continuar de onde parou</span>
              <span className="block truncate max-w-[200px] text-xs font-bold text-[#173B70]">
                {nextActivity.title}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Individual Progress & Routine Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Atividades Concluídas */}
        <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#526176] font-medium block">Atividades Concluídas</span>
            <span className="text-2xl font-bold text-[#173B70] tabular-nums">
              {completedList.length} <span className="text-xs text-[#526176] font-normal">de {activities.length}</span>
            </span>
          </div>
        </div>

        {/* Estrelas de Dedicação */}
        <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#526176] font-medium block">Estrelas de Dedicação</span>
            <span className="text-2xl font-bold text-[#173B70] tabular-nums">
              {currentStudent?.totalStars || 0}
            </span>
          </div>
        </div>

        {/* Foco Sereno */}
        <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#526176] font-medium block">Tempo com Serenidade</span>
            <span className="text-2xl font-bold text-[#173B70] tabular-nums">
              {currentStudent?.peacefulFocusMinutes || 0} min
            </span>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="bg-white rounded-3xl border border-blue-100 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#173B70]">Minhas Atividades de Aprendizagem</h2>
            <p className="text-xs text-[#526176]">
              Atividades acolhedoras de rotina, autonomia, equipe e convivência preparadas pela turma
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-white text-[#173B70] shadow-xs'
                  : 'text-[#526176] hover:text-[#173B70]'
              }`}
            >
              Todas ({activities.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('ongoing')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'ongoing'
                  ? 'bg-white text-[#173B70] shadow-xs'
                  : 'text-[#526176] hover:text-[#173B70]'
              }`}
            >
              Disponíveis ({ongoingList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('done')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'done'
                  ? 'bg-white text-[#173B70] shadow-xs'
                  : 'text-[#526176] hover:text-[#173B70]'
              }`}
            >
              Concluídas ({completedList.length})
            </button>
          </div>
        </div>

        {/* Activity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedActivities.map((act) => {
            const isCompleted = completedIds.includes(act.id);
            return (
              <div
                key={act.id}
                className="p-5 rounded-2xl border border-blue-100 bg-[#F4F8FF]/50 hover:bg-[#F4F8FF] transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#526176] mb-2">
                    <span className="font-semibold text-[#2563EB]">{act.topic}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {act.estimatedMinutes} min
                    </span>
                  </div>

                  <h3 className={`font-bold text-[#173B70] mb-1 leading-snug ${fontSizeClassName}`}>
                    {act.title}
                  </h3>
                  <p className="text-xs text-[#526176] line-clamp-2 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-blue-50">
                  <div className="flex items-center gap-1 text-xs">
                    {isCompleted ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Concluída
                      </span>
                    ) : (
                      <span className="text-[#2563EB] font-medium flex items-center gap-1">
                        <FolderOpen className="w-4 h-4" />
                        {act.steps.length} etapas
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveActivity(act)}
                    className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>{isCompleted ? 'Rever' : 'Começar'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
