import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Download, 
  Trash2, 
  AlertTriangle,
  History,
  CheckCircle2
} from 'lucide-react';

export const PrivacySecuritySettings: React.FC = () => {
  const { auditLogs, students } = useAuth();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [exportNotice, setExportNotice] = useState(false);

  const filteredLogs = auditLogs.filter((log) => {
    if (filterCategory === 'all') return true;
    return log.category === filterCategory;
  });

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({
        exportDate: new Date().toISOString(),
        lgpdCompliance: 'Lei Geral de Proteção de Dados (Lei nº 13.709/2018) - Artigos 11 e 14',
        registeredStudentsCount: students.length,
        students: students.map((s) => ({
          name: s.name,
          registrationNumber: s.registrationNumber,
          schoolClass: s.schoolClass,
          consent: s.consent,
          biometricsConfigured: s.biometrics.isConfigured,
          accessibilityPreferences: s.preferences,
        })),
        auditHistory: auditLogs,
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aura_lgpd_relatorio_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Title */}
      <div className="bg-white rounded-3xl border border-blue-100 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wide block mb-1">
            Conformidade Legal & Segurança
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#173B70]">
            Privacidade, Biometria & LGPD
          </h1>
          <p className="text-xs text-[#526176] mt-0.5">
            Governança de dados sensíveis de menores e auditoria de acessos
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportData}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório LGPD</span>
        </button>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Relatório de conformidade exportado com sucesso em conformidade com o Artigo 18 da LGPD.</span>
        </div>
      )}

      {/* Security Principles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-blue-100 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#173B70]">Vetor Biométrico Irreversível</h3>
          <p className="text-xs text-[#526176] leading-relaxed">
            Nenhuma foto facial crua é gravada no banco de dados. Os pontos faciais são convertidos em um hash vetorial unidirecional (one-way).
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-blue-100 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#173B70]">Consentimento dos Responsáveis</h3>
          <p className="text-xs text-[#526176] leading-relaxed">
            Cada aluno menor de idade possui autorização formal de pais ou responsáveis para uso da plataforma pedagógica, revogável a qualquer momento.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-blue-100 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#173B70]">Retenção & Descarte Seguro</h3>
          <p className="text-xs text-[#526176] leading-relaxed">
            Ao final do ano letivo ou após solicitação do responsável, todos os registros e modelos biométricos associados ao aluno são expurgados permanentemente.
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-blue-100 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-base font-bold text-[#173B70]">
              Registro de Auditoria Administrativa (Audit Log)
            </h2>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {(['all', 'biometria', 'acesso', 'preferencias', 'consentimento'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  filterCategory === cat
                    ? 'bg-white text-[#173B70] shadow-xs'
                    : 'text-[#526176] hover:text-[#173B70]'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F8FF] text-[#173B70] border-b border-blue-100">
              <tr>
                <th className="py-2.5 px-3 font-bold">Data & Hora</th>
                <th className="py-2.5 px-3 font-bold">Ação</th>
                <th className="py-2.5 px-3 font-bold">Autor</th>
                <th className="py-2.5 px-3 font-bold">Categoria</th>
                <th className="py-2.5 px-3 font-bold">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#173B70]">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    {log.actor}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="capitalize text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
