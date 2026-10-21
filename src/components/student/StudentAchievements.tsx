import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Trophy, Heart, Clock, CheckCircle2, Star } from 'lucide-react';

export const StudentAchievements: React.FC = () => {
  const { currentStudent } = useAuth();

  const achievements = [
    {
      id: 'ach-1',
      title: 'Primeiro Passo na Rotina',
      description: 'Concluiu a atividade de organização da rotina escolar com muita dedicação.',
      unlocked: (currentStudent?.completedActivityIds.length || 0) >= 1,
      icon: Star,
      date: 'Conquistado',
    },
    {
      id: 'ach-2',
      title: 'Mestre da Organização',
      description: 'Aprendeu a organizar tarefas e materiais com calma e autonomia.',
      unlocked: (currentStudent?.skillMastery.organizacaoRotina || 0) >= 70,
      icon: CheckCircle2,
      date: 'Conquistado',
    },
    {
      id: 'ach-3',
      title: 'Colega Acolhedor e Empático',
      description: 'Compreendeu o valor da escuta atenciosa e do respeito às diferenças.',
      unlocked: (currentStudent?.completedActivityIds.length || 0) >= 2,
      icon: Heart,
      date: 'Em progresso',
    },
    {
      id: 'ach-4',
      title: 'Tempo de Foco Tranquilo',
      description: 'Acumulou mais de 30 minutos de aprendizagem no seu próprio ritmo.',
      unlocked: (currentStudent?.peacefulFocusMinutes || 0) >= 30,
      icon: Clock,
      date: 'Conquistado',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="bg-white rounded-3xl border border-blue-100 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#173B70]">
              Minhas Conquistas Pessoais
            </h1>
            <p className="text-xs text-[#526176]">
              Seu crescimento no curso de Administração, respeitando sempre o seu ritmo individual
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {achievements.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  item.unlocked
                    ? 'bg-[#F4F8FF] border-blue-200'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    item.unlocked ? 'bg-[#2563EB] text-white shadow-xs' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#173B70]">{item.title}</h3>
                    {item.unlocked && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-[#DDF7E8] px-2 py-0.5 rounded-full">
                        Ativa
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#526176] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
