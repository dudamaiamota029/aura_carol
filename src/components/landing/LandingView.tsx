import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Camera, 
  GraduationCap, 
  Type, 
  ShieldCheck, 
  Sparkles, 
  HeartHandshake, 
  CheckCircle,
  Compass,
  Heart,
  Smile
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const { setViewMode } = useAuth();
  const { preferences } = useAccessibility();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column (prose & primary CTAs) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DBEAFE] text-xs font-bold text-[#173B70]">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Plataforma Educacional Adaptativa e Inclusiva</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#173B70] tracking-tight leading-[1.15]">
                Aprender do seu jeito.
              </h1>
              <p className="text-lg sm:text-xl text-[#526176] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Um espaço onde cada aluno aprende no seu próprio ritmo.
              </p>
            </div>

            <p className="text-sm text-[#526176] leading-relaxed max-w-lg mx-auto lg:mx-0">
              O Aura é uma plataforma de aprendizagem acolhedora, adaptativa e intuitiva desenvolvida para estudantes com Transtorno do Espectro Autista (TEA), TDAH e dificuldades de leitura. Oferece acesso facial sem digitação de senhas, alternância funcional entre letra cursiva e bastão, e acompanhamento pedagógico humanizado.
            </p>

            {/* The Two Main Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={() => setViewMode('student_auth')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <Camera className="w-5 h-5" />
                <span>Sou aluno</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('teacher_login')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-blue-50/80 text-[#173B70] border-2 border-blue-200 font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-xs hover:border-[#2563EB] transition-all active:scale-[0.98]"
              >
                <GraduationCap className="w-5 h-5 text-[#2563EB]" />
                <span>Sou professor</span>
              </button>
            </div>

            {/* Trust bullet features without boxes */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-[#526176] pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Autonomia sem barreiras
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Acesso facial seguro (LGPD)
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Letra Cursiva & Bastão reais
              </span>
            </div>
          </div>

          {/* Right Column (Hero Graphic) */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden border border-blue-100 shadow-md bg-white">
              <img
                src="/src/assets/images/hero_aura_learning_1792536855995.jpg"
                alt="Ambiente de aprendizagem acolhedor e organizado do Aura"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Inclusive Methodology Section */}
      <section id="metodologia" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wide">
            Metodologia Acolhedora
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#173B70]">
            Projetado para o ritmo de cada mente
          </h2>
          <p className="text-xs sm:text-sm text-[#526176]">
            Estrutura sensorial e cognitiva desenhada para reduzir ansiedade e potencializar a aprendizagem
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: '1. Acolhimento & Escuta',
              concept: 'Ambiente seguro e previsível',
              description: 'Interface limpa, sem poluição visual, sem animações bruscas e com rotinas visuais que transmitem segurança e tranquilidade.',
              icon: Heart,
            },
            {
              title: '2. Tarefas em Pequenas Etapas',
              concept: 'Um passo de cada vez',
              description: 'Divisão de conteúdos longos em pequenos passos sucessivos, com destaque para a instrução principal e pausas voluntárias.',
              icon: Compass,
            },
            {
              title: '3. Acesso Facial Sem Senhas',
              concept: 'Independência imediata',
              description: 'O aluno entra no seu espaço por reconhecimento facial protegido ou chave ilustrada, sem necessidade de memorizar senhas complexas.',
              icon: ShieldCheck,
            },
            {
              title: '4. Liberdade de Leitura',
              concept: 'Escolher como quero ler',
              description: 'Alternância funcional instantânea entre letra cursiva escolar, letra bastão de forma e sem serifa de alta legibilidade.',
              icon: Type,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl border border-blue-100 bg-white shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#173B70]">{item.title}</h3>
                  <span className="text-xs font-medium text-[#2563EB] block mt-0.5">
                    {item.concept}
                  </span>
                  <p className="text-xs text-[#526176] mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Accessible Features & Font Customization Section */}
      <section id="recursos" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-blue-100 p-8 sm:p-12 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wide">
              Acessibilidade Sem Barreiras
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#173B70]">
              O ensino se adapta ao aluno, e não o aluno ao ensino
            </h2>
            <p className="text-xs sm:text-sm text-[#526176]">
              Aura coloca a autonomia do estudante no centro da experiência educacional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#F4F8FF] border border-blue-50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center">
                <Type className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#173B70]">
                Escolher Como Quero Ler
              </h3>
              <p className="text-xs text-[#526176] leading-relaxed">
                Alternância funcional instantânea entre letra cursiva escolar, letra bastão de forma e tipografia sem serifa de alta legibilidade, com ajuste livre de tamanhos e espaçamentos.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F4F8FF] border border-blue-50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#173B70]">
                Acesso Facial Amigável & Protegido
              </h3>
              <p className="text-xs text-[#526176] leading-relaxed">
                O aluno não precisa memorizar senhas difíceis. Sistema com teste de vivacidade (liveness), conformidade com a LGPD e chave ilustrada alternativa.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F4F8FF] border border-blue-50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#173B70]">
                Feedback Positivo & Sem Pressão
              </h3>
              <p className="text-xs text-[#526176] leading-relaxed">
                Sem sons estridentes ou telas vermelhas de erro. O sistema oferece dicas construtivas, pausas voluntárias e incentivo ao progresso pessoal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#526176]">
        <div>
          <span className="font-bold text-[#173B70]">Aura</span> — Plataforma Educacional Adaptativa e Inclusiva.
        </div>
        <div className="flex items-center gap-4">
          <span>LGPD & ECA Compliance</span>
          <span aria-hidden="true">·</span>
          <span>Inclusão TEA & TDAH</span>
          <span aria-hidden="true">·</span>
          <span>Acessibilidade Universal</span>
        </div>
      </footer>
    </div>
  );
};
