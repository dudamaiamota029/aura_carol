import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Student, Activity } from '../../types';
import { StudentRegistrationModal } from './StudentRegistrationModal';
import { BiometricSetupModal } from './BiometricSetupModal';
import { ActivityEditorModal } from './ActivityEditorModal';
import { PedagogicalReports } from './PedagogicalReports';
import { PrivacySecuritySettings } from './PrivacySecuritySettings';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  UserPlus, 
  PlusCircle, 
  BarChart3, 
  Camera, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert,
  Sparkles,
  Clock,
  KeyRound
} from 'lucide-react';

interface TeacherDashboardProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ currentTab, onTabChange }) => {
  const { teacher, students, activities, registerOrUpdateStudent, deleteStudent, saveActivity } = useAuth();

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [studentForBiometrics, setStudentForBiometrics] = useState<Student | null>(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);

  // Selected class filter
  const [selectedClass, setSelectedClass] = useState<string>('all');

  const studentsNeedingSupport = students.filter((s) => s.needsPedagogicalSupport);
  const totalCompletedCount = students.reduce((sum, s) => sum + s.completedActivityIds.length, 0);

  const filteredStudents = students.filter((s) => {
    if (selectedClass === 'all') return true;
    return s.schoolClass === selectedClass;
  });

  const handleOpenBiometricSetup = (student: Student) => {
    setStudentForBiometrics(student);
    setIsBiometricModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setIsStudentModalOpen(true);
  };

  const handleCreateStudent = () => {
    setStudentToEdit(null);
    setIsStudentModalOpen(true);
  };

  const handleCreateActivity = () => {
    setActivityToEdit(null);
    setIsActivityModalOpen(true);
  };

  const handleEditActivity = (act: Activity) => {
    setActivityToEdit(act);
    setIsActivityModalOpen(true);
  };

  // Render Sub-Views based on currentTab
  if (currentTab === 'reports') {
    return <PedagogicalReports />;
  }

  if (currentTab === 'security') {
    return <PrivacySecuritySettings />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Welcome Greeting Banner */}
      <div className="bg-white rounded-3xl border border-blue-100 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-[#2563EB]">
            <Sparkles className="w-4 h-4" />
            <span>Gestão Docente & Acompanhamento Pedagógico</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#173B70] tracking-tight">
            Olá, {teacher?.name || 'Professor(a)'}!
          </h1>
          <p className="text-xs sm:text-sm text-[#526176] mt-1 max-w-xl">
            {teacher?.schoolName} · Acompanhe o progresso adaptativo, configure o acesso facial seguro e gerencie as atividades inclusivas.
          </p>
        </div>

        {/* Quick Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCreateStudent}
            className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Aluno</span>
          </button>
          <button
            type="button"
            onClick={handleCreateActivity}
            className="px-4 py-2.5 rounded-xl bg-[#173B70] hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar Atividade</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('reports')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-[#173B70] text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Desempenho</span>
          </button>
        </div>
      </div>

      {/* Metric Counters (Cards simples com números tabulares) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Alunos Cadastrados */}
        <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#526176] font-medium block">Alunos Cadastrados</span>
            <span className="text-2xl font-bold text-[#173B70] tabular-nums">
              {students.length}
            </span>
          </div>
        </div>

        {/* Atividades Criadas */}
        <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#526176] font-medium block">Atividades Criadas</span>
            <span className="text-2xl font-bold text-[#173B70] tabular-nums">
              {activities.length}
            </span>
          </div>
        </div>

        {/* Atividades Concluídas */}
        <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#526176] font-medium block">Etapas Concluídas</span>
            <span className="text-2xl font-bold text-[#173B70] tabular-nums">
              {totalCompletedCount}
            </span>
          </div>
        </div>

        {/* Alunos com Apoio Pedagógico */}
        <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-xs flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            studentsNeedingSupport.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'
          }`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#526176] font-medium block">Pedem Acompanhamento</span>
            <span className="text-2xl font-bold text-[#173B70] tabular-nums">
              {studentsNeedingSupport.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area (Students & Activities) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Students Table with Biometrics */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-blue-100 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#173B70]">
                Alunos Vinculados & Biometria Facial
              </h2>
              <p className="text-xs text-[#526176]">
                Configure o acesso facial seguro com o aluno presente ou use o PIN de contingência
              </p>
            </div>

            {/* Class filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-[#526176]">Turma:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-2.5 py-1 rounded-xl border border-slate-300 text-xs text-[#173B70] bg-[#F4F8FF] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="all">Todas as turmas</option>
                <option value="1º Ano Técnico - Turma A">1º Ano Técnico - Turma A</option>
                <option value="1º Ano Técnico - Turma B">1º Ano Técnico - Turma B</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F8FF] text-[#173B70] border-b border-blue-100">
                <tr>
                  <th className="py-2.5 px-3 font-bold">Estudante</th>
                  <th className="py-2.5 px-3 font-bold">Turma</th>
                  <th className="py-2.5 px-3 font-bold">Acesso Facial</th>
                  <th className="py-2.5 px-3 font-bold">Preferência Leitura</th>
                  <th className="py-2.5 px-3 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={st.avatarUrl}
                          alt={st.preferredName}
                          className="w-8 h-8 rounded-full bg-blue-50 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-[#173B70] block">{st.name}</span>
                          <span className="text-[10px] text-[#526176]">
                            Matrícula: {st.registrationNumber}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#526176] whitespace-nowrap">
                      {st.schoolClass}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {st.biometrics.isConfigured ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Ativo ({st.biometrics.qualityScore}%)
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenBiometricSetup(st)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Configurar Facial
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#526176] capitalize">
                      {st.preferences.fontChoice} ({st.preferences.fontSize})
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenBiometricSetup(st)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                          title="Gerenciar Acesso Facial"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditStudent(st)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                          title="Editar cadastro e preferências"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Deseja excluir os dados e biometria de ${st.name}?`)) {
                              deleteStudent(st.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                          title="Excluir aluno (LGPD)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 col): Activities & Support Watchlist */}
        <div className="space-y-6">
          {/* Watchlist: Needs pedagogical support */}
          <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#173B70] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Atenção Pedagógica
              </h2>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {studentsNeedingSupport.length} Aluno(s)
              </span>
            </div>

            {studentsNeedingSupport.length === 0 ? (
              <p className="text-xs text-slate-500">
                Nenhum estudante solicitou apoio adicional nas últimas atividades.
              </p>
            ) : (
              <div className="space-y-2.5">
                {studentsNeedingSupport.map((st) => (
                  <div key={st.id} className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs">
                    <span className="font-bold text-amber-950 block">{st.name}</span>
                    <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                      {st.supportReason || 'Necessita de adaptação de tempo ou apoio em áudio.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => onTabChange('reports')}
                      className="mt-2 text-[10px] font-bold text-[#2563EB] hover:underline block"
                    >
                      Ver diagnóstico e dicas com IA →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activities List */}
          <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#173B70] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2563EB]" />
                Atividades do Projeto de Inclusão
              </h2>
              <button
                type="button"
                onClick={handleCreateActivity}
                className="text-xs font-bold text-[#2563EB] hover:underline"
              >
                + Nova
              </button>
            </div>

            <div className="space-y-2">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-2xl border border-slate-100 bg-[#F4F8FF]/50 hover:bg-[#F4F8FF] transition-colors flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <span className="text-xs font-bold text-[#173B70] block truncate">
                      {act.title}
                    </span>
                    <span className="text-[10px] text-[#526176] block">
                      {act.topic} · {act.steps.length} etapas
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleEditActivity(act)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                    title="Editar atividade"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StudentRegistrationModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={registerOrUpdateStudent}
        studentToEdit={studentToEdit}
      />

      {studentForBiometrics && (
        <BiometricSetupModal
          student={studentForBiometrics}
          isOpen={isBiometricModalOpen}
          onClose={() => {
            setIsBiometricModalOpen(false);
            setStudentForBiometrics(null);
          }}
          onSuccess={(updatedStudent) => {
            registerOrUpdateStudent(updatedStudent);
          }}
        />
      )}

      <ActivityEditorModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={saveActivity}
        activityToEdit={activityToEdit}
      />
    </div>
  );
};
