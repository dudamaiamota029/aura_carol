import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';

export const TeacherLogin: React.FC = () => {
  const { loginTeacher, setViewMode } = useAuth();
  const [email, setEmail] = useState('marina.albuquerque@escola.edu.br');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await loginTeacher(email, password);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Erro ao efetuar login.');
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverySent(true);
    setTimeout(() => {
      setShowRecoveryModal(false);
      setRecoverySent(false);
    }, 2500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-[#F4F8FF]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-blue-100 p-6 sm:p-8">
        <button
          type="button"
          onClick={() => setViewMode('landing')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#526176] hover:text-[#173B70] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </button>

        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[#2563EB]">
          <ShieldCheck className="w-4 h-4" />
          <span>Portal Docente Seguro</span>
        </div>

        <h1 className="text-2xl font-bold text-[#173B70] tracking-tight mb-1">
          Área do Professor
        </h1>
        <p className="text-xs text-[#526176] mb-6">
          Acesse para gerenciar alunos, biometrias, atividades de Administração e relatórios
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#173B70] mb-1.5">
              E-mail Institucional
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.nome@escola.edu.br"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#173B70]">
                Senha
              </label>
              <button
                type="button"
                onClick={() => setShowRecoveryModal(true)}
                className="text-[11px] text-[#2563EB] hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? 'Autenticando...' : 'Entrar no Painel do Professor'}
          </button>
        </form>

        <div className="mt-6 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-[#526176]">
          <span className="font-bold text-[#173B70] block mb-0.5">Acesso de Demonstração:</span>
          Use <code className="text-blue-700">marina.albuquerque@escola.edu.br</code> com senha <code className="text-blue-700">admin123</code>.
        </div>
      </div>

      {/* Password Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-blue-100">
            <h3 className="text-base font-bold text-[#173B70] mb-2">Recuperar Acesso</h3>
            {recoverySent ? (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                Link de redefinição enviado com sucesso para seu e-mail institucional!
              </p>
            ) : (
              <form onSubmit={handleRecovery} className="space-y-3">
                <p className="text-xs text-[#526176]">
                  Informe seu e-mail para receber as instruções de recuperação com verificação em duas etapas.
                </p>
                <input
                  type="email"
                  required
                  defaultValue={email}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRecoveryModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#2563EB] rounded-xl hover:bg-blue-700"
                  >
                    Enviar Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
