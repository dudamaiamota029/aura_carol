import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { AccessibilityToolbar } from './AccessibilityToolbar';
import { GlobalAudioButton } from './GlobalAudioButton';
import { Type, LogOut, User, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
  const { viewMode, setViewMode, teacher, currentStudent, logoutTeacher, logoutStudent } = useAuth();
  const { preferences } = useAccessibility();
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (viewMode !== 'teacher_app' && viewMode !== 'student_app') {
                  setViewMode('landing');
                }
              }}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-2xl font-bold tracking-tight text-[#173B70] group-hover:text-[#2563EB] transition-colors whitespace-nowrap">
                Aura
              </span>
            </button>
            <span className="hidden sm:inline-block text-xs font-medium text-[#526176] border-l border-slate-200 pl-3">
              Educação Adaptativa
            </span>
          </div>

          {/* Zone 2: Single-line Nav Links based on Context */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#526176] shrink-0">
            {viewMode === 'landing' && (
              <>
                <button
                  type="button"
                  onClick={() => setViewMode('student_auth')}
                  className="hover:text-[#173B70] transition-colors whitespace-nowrap"
                >
                  Área do Aluno
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('teacher_login')}
                  className="hover:text-[#173B70] transition-colors whitespace-nowrap"
                >
                  Área do Professor
                </button>
                <a
                  href="#metodologia"
                  className="hover:text-[#173B70] transition-colors whitespace-nowrap"
                >
                  Metodologia TEA & TDAH
                </a>
                <a
                  href="#recursos"
                  className="hover:text-[#173B70] transition-colors whitespace-nowrap"
                >
                  Recursos Adaptativos
                </a>
              </>
            )}

            {viewMode === 'teacher_app' && (
              <>
                <button
                  type="button"
                  onClick={() => onTabChange && onTabChange('dashboard')}
                  className={`hover:text-[#173B70] transition-colors whitespace-nowrap ${
                    currentTab === 'dashboard' ? 'text-[#2563EB] font-semibold border-b-2 border-[#2563EB] pb-0.5' : ''
                  }`}
                >
                  Painel Geral
                </button>
                <button
                  type="button"
                  onClick={() => onTabChange && onTabChange('students')}
                  className={`hover:text-[#173B70] transition-colors whitespace-nowrap ${
                    currentTab === 'students' ? 'text-[#2563EB] font-semibold border-b-2 border-[#2563EB] pb-0.5' : ''
                  }`}
                >
                  Alunos & Biometria
                </button>
                <button
                  type="button"
                  onClick={() => onTabChange && onTabChange('activities')}
                  className={`hover:text-[#173B70] transition-colors whitespace-nowrap ${
                    currentTab === 'activities' ? 'text-[#2563EB] font-semibold border-b-2 border-[#2563EB] pb-0.5' : ''
                  }`}
                >
                  Atividades de ADM
                </button>
                <button
                  type="button"
                  onClick={() => onTabChange && onTabChange('reports')}
                  className={`hover:text-[#173B70] transition-colors whitespace-nowrap ${
                    currentTab === 'reports' ? 'text-[#2563EB] font-semibold border-b-2 border-[#2563EB] pb-0.5' : ''
                  }`}
                >
                  Relatórios Pedagógicos
                </button>
                <button
                  type="button"
                  onClick={() => onTabChange && onTabChange('security')}
                  className={`hover:text-[#173B70] transition-colors whitespace-nowrap ${
                    currentTab === 'security' ? 'text-[#2563EB] font-semibold border-b-2 border-[#2563EB] pb-0.5' : ''
                  }`}
                >
                  LGPD & Segurança
                </button>
              </>
            )}

            {viewMode === 'student_app' && (
              <>
                <button
                  type="button"
                  onClick={() => onTabChange && onTabChange('home')}
                  className={`hover:text-[#173B70] transition-colors whitespace-nowrap ${
                    currentTab === 'home' ? 'text-[#2563EB] font-semibold border-b-2 border-[#2563EB] pb-0.5' : ''
                  }`}
                >
                  Meu Início
                </button>
                <button
                  type="button"
                  onClick={() => onTabChange && onTabChange('activities')}
                  className={`hover:text-[#173B70] transition-colors whitespace-nowrap ${
                    currentTab === 'activities' ? 'text-[#2563EB] font-semibold border-b-2 border-[#2563EB] pb-0.5' : ''
                  }`}
                >
                  Minhas Atividades
                </button>
                <button
                  type="button"
                  onClick={() => onTabChange && onTabChange('achievements')}
                  className={`hover:text-[#173B70] transition-colors whitespace-nowrap ${
                    currentTab === 'achievements' ? 'text-[#2563EB] font-semibold border-b-2 border-[#2563EB] pb-0.5' : ''
                  }`}
                >
                  Minhas Conquistas
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Primary Action & Accessibility Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Audio narration button for students with reading difficulties */}
            <GlobalAudioButton />

            {/* Quick "Escolher como quero ler" always visible for students and demo */}
            <button
              type="button"
              onClick={() => setIsReadingModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#DBEAFE]/60 hover:bg-[#DBEAFE] text-[#173B70] border border-blue-200 transition-colors whitespace-nowrap"
              title="Abrir configurações de leitura (cursiva, bastão, tamanho)"
            >
              <Type className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="hidden sm:inline">Como quero ler</span>
              <span className="sm:hidden">Letra</span>
            </button>

            {viewMode === 'landing' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('student_auth')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] rounded-xl hover:bg-blue-700 transition-colors shadow-xs whitespace-nowrap"
                >
                  Entrada do Aluno
                </button>
              </div>
            )}

            {viewMode === 'teacher_login' && (
              <button
                type="button"
                onClick={() => setViewMode('landing')}
                className="px-3 py-1.5 text-xs font-medium text-[#526176] hover:text-[#173B70] transition-colors whitespace-nowrap"
              >
                Voltar
              </button>
            )}

            {viewMode === 'student_auth' && (
              <button
                type="button"
                onClick={() => setViewMode('landing')}
                className="px-3 py-1.5 text-xs font-medium text-[#526176] hover:text-[#173B70] transition-colors whitespace-nowrap"
              >
                Início
              </button>
            )}

            {viewMode === 'teacher_app' && (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-semibold text-[#173B70]">{teacher?.name}</span>
                  <span className="text-[10px] text-[#526176]">Docente de Administração</span>
                </div>
                <button
                  type="button"
                  onClick={logoutTeacher}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 transition-colors whitespace-nowrap"
                  title="Sair com segurança"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            )}

            {viewMode === 'student_app' && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2.5 py-1 bg-blue-50 rounded-xl border border-blue-100">
                  <img
                    src={currentStudent?.avatarUrl}
                    alt={currentStudent?.preferredName}
                    className="w-6 h-6 rounded-full bg-white"
                  />
                  <span className="text-xs font-semibold text-[#173B70]">
                    {currentStudent?.preferredName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logoutStudent}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
                  title="Pausar e sair com tranquilidade"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pausar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Accessible Reading Modal */}
      <AccessibilityToolbar
        isOpen={isReadingModalOpen}
        onClose={() => setIsReadingModalOpen(false)}
      />
    </>
  );
};
