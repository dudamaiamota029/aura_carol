import React, { useState } from 'react';
import { Student, FontChoice, FontSizeChoice, LineHeightChoice, LetterSpacingChoice } from '../../types';
import { UserPlus, X, Shield, Lock, Eye, Check } from 'lucide-react';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  studentToEdit?: Student | null;
}

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
}) => {
  const [fullName, setFullName] = useState(studentToEdit?.name || '');
  const [preferredName, setPreferredName] = useState(studentToEdit?.preferredName || '');
  const [registrationNumber, setRegistrationNumber] = useState(studentToEdit?.registrationNumber || `ADM-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [schoolClass, setSchoolClass] = useState(studentToEdit?.schoolClass || '1º Ano Técnico - Turma A');
  const [schoolYear, setSchoolYear] = useState(studentToEdit?.schoolYear || 'Ensino Médio Integrado em Administração');
  const [supportLevel, setSupportLevel] = useState<'1' | '2'>(studentToEdit?.supportLevel || '1');
  
  // Accessibility preferences
  const [fontChoice, setFontChoice] = useState<FontChoice>(studentToEdit?.preferences.fontChoice || 'bastao');
  const [fontSize, setFontSize] = useState<FontSizeChoice>(studentToEdit?.preferences.fontSize || 'lg');
  const [letterSpacing, setLetterSpacing] = useState<LetterSpacingChoice>(studentToEdit?.preferences.letterSpacing || 'wide');
  const [lineHeight, setLineHeight] = useState<LineHeightChoice>(studentToEdit?.preferences.lineHeight || 'relaxed');
  const [enableAudioNarrator, setEnableAudioNarrator] = useState(studentToEdit?.preferences.enableAudioNarrator ?? true);
  const [reduceMotion, setReduceMotion] = useState(studentToEdit?.preferences.reduceMotion ?? false);
  const [highlightMainInstruction, setHighlightMainInstruction] = useState(studentToEdit?.preferences.highlightMainInstruction ?? true);
  const [calmPacing, setCalmPacing] = useState(studentToEdit?.preferences.calmPacing ?? true);

  // Restricted diagnostic observations
  const [restrictedClinicalNotes, setRestrictedClinicalNotes] = useState(studentToEdit?.restrictedClinicalNotes || '');
  const [guardianName, setGuardianName] = useState(studentToEdit?.consent.grantedBy || '');
  const [consentGranted, setConsentGranted] = useState(studentToEdit?.consent.consentGranted ?? true);
  const [altPin, setAltPin] = useState(studentToEdit?.biometrics.alternativePin || '1234');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newStudent: Student = {
      id: studentToEdit?.id || `aura-std-${Date.now()}`,
      name: fullName.trim(),
      preferredName: preferredName.trim() || fullName.split(' ')[0],
      registrationNumber: registrationNumber.trim(),
      schoolClass,
      schoolYear,
      avatarUrl: studentToEdit?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(preferredName || fullName)}&backgroundColor=dbeafe`,
      supportLevel,
      preferences: {
        fontChoice,
        fontSize,
        letterSpacing,
        lineHeight,
        highContrast: false,
        highlightMainInstruction,
        reduceMotion,
        enableAudioNarrator,
        soundFeedback: !reduceMotion,
        hideSecondaryDetails: false,
        calmPacing,
      },
      biometrics: studentToEdit?.biometrics || {
        isConfigured: false,
        livenessVerified: false,
        qualityScore: 0,
        alternativePin: altPin,
        alternativeSymbols: ['Estrela', 'Livro', 'Lápis'],
      },
      consent: {
        consentGranted,
        grantedBy: guardianName || 'Responsável Legal Cadastrado',
        relationship: 'pai_mae',
        consentDate: studentToEdit?.consent.consentDate || new Date().toISOString(),
        purposeAccepted: true,
        canRevokeAnytime: true,
      },
      completedActivityIds: studentToEdit?.completedActivityIds || [],
      skillMastery: studentToEdit?.skillMastery || {
        organizacaoRotina: 50,
        trabalhoEquipe: 50,
        autonomiaMetas: 50,
        comunicacaoEmpatica: 50,
        financasCotidiano: 50,
      },
      totalStars: studentToEdit?.totalStars || 0,
      peacefulFocusMinutes: studentToEdit?.peacefulFocusMinutes || 0,
      needsPedagogicalSupport: studentToEdit?.needsPedagogicalSupport || false,
      restrictedClinicalNotes: restrictedClinicalNotes.trim(),
    };

    onSave(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F4F8FF] border-b border-blue-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#173B70]">
                {studentToEdit ? 'Editar Dados do Estudante' : 'Cadastrar Novo Aluno no Aura'}
              </h2>
              <span className="text-[11px] text-[#526176]">
                Personalização de ensino e configurações de acessibilidade para Administração
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* 1. Dados Básicos */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#173B70] uppercase tracking-wide">
              1. Identificação Escolar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#173B70] block mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Mateus Camargo"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#173B70] block mb-1">
                  Nome ou Tratamento Preferido *
                </label>
                <input
                  type="text"
                  required
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  placeholder="Como o aluno prefere ser chamado (Ex: Teo)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#173B70] block mb-1">
                  Identificador Interno (Matrícula)
                </label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#173B70] block mb-1">
                  Turma
                </label>
                <select
                  value={schoolClass}
                  onChange={(e) => setSchoolClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="1º Ano Técnico - Turma A">1º Ano Técnico - Turma A</option>
                  <option value="1º Ano Técnico - Turma B">1º Ano Técnico - Turma B</option>
                  <option value="2º Ano Técnico - Turma A">2º Ano Técnico - Turma A</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Preferências de Acessibilidade & Leitura */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-[#173B70] uppercase tracking-wide">
              2. Preferências de Leitura & Acessibilidade
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#173B70] block mb-1">
                  Estilo de Fonte Inicial
                </label>
                <select
                  value={fontChoice}
                  onChange={(e) => setFontChoice(e.target.value as FontChoice)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="cursiva">Letra Cursiva</option>
                  <option value="bastao">Letra Bastão / Caixa Alta</option>
                  <option value="legivel">Sem Serifa / Alta Legibilidade</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#173B70] block mb-1">
                  Tamanho da Letra
                </label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value as FontSizeChoice)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="sm">Pequeno</option>
                  <option value="md">Médio</option>
                  <option value="lg">Grande (Recomendado)</option>
                  <option value="xl">Extra Grande</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#173B70] block mb-1">
                  Nível de Suporte Pedagógico
                </label>
                <select
                  value={supportLevel}
                  onChange={(e) => setSupportLevel(e.target.value as '1' | '2')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="1">Nível 1 (Suporte Leve / Autonomia Guiada)</option>
                  <option value="2">Nível 2 (Suporte Substancial / Etapas Curtas)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableAudioNarrator}
                  onChange={(e) => setEnableAudioNarrator(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded-sm"
                />
                <span className="text-xs font-medium text-[#173B70]">
                  Ativar narração em áudio dos enunciados
                </span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highlightMainInstruction}
                  onChange={(e) => setHighlightMainInstruction(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded-sm"
                />
                <span className="text-xs font-medium text-[#173B70]">
                  Destacar visualmente a instrução principal
                </span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reduceMotion}
                  onChange={(e) => setReduceMotion(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded-sm"
                />
                <span className="text-xs font-medium text-[#173B70]">
                  Reduzir estímulos visuais e animações
                </span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={calmPacing}
                  onChange={(e) => setCalmPacing(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded-sm"
                />
                <span className="text-xs font-medium text-[#173B70]">
                  Ritmo calmo sem limite de tempo
                </span>
              </label>
            </div>
          </div>

          {/* 3. Observações Clínicas Restritas (Protegidas) */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
              <Lock className="w-3.5 h-3.5" />
              <span>Anotações Pedagógicas & Clínicas Restritas (Opcional - Nunca exibidas a alunos)</span>
            </div>
            <textarea
              rows={2}
              value={restrictedClinicalNotes}
              onChange={(e) => setRestrictedClinicalNotes(e.target.value)}
              placeholder="Ex: Aluno beneficia-se de rotina visual previsível e pausas a cada 10 min. Não forçar tarefas orais em grupo."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* 4. PIN Alternativo de Acesso */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-[#173B70] uppercase tracking-wide">
              3. Alternativa de Entrada Acessível (PIN)
            </h3>
            <p className="text-[11px] text-[#526176]">
              Caso o aluno não queira ou não consiga utilizar o reconhecimento facial, este PIN de 4 dígitos garantirá sua entrada autônoma.
            </p>
            <input
              type="text"
              maxLength={4}
              value={altPin}
              onChange={(e) => setAltPin(e.target.value)}
              placeholder="1234"
              className="w-32 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-center"
            />
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
              {studentToEdit ? 'Salvar Alterações' : 'Cadastrar Estudante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
