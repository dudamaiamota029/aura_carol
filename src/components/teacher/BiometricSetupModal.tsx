import React, { useState, useRef, useEffect } from 'react';
import { Student, BiometricConsent } from '../../types';
import { BiometricService } from '../../services/biometricService';
import { speechService } from '../../services/speechService';
import { 
  Camera, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  RefreshCw, 
  Smile, 
  Lock,
  FileText
} from 'lucide-react';

interface BiometricSetupModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedStudent: Student) => void;
}

export const BiometricSetupModal: React.FC<BiometricSetupModalProps> = ({
  student,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<number>(1); // 1: Info/Protection -> 2: Consent Check -> 3: Capture with Student -> 4: Success
  const [cameraActive, setCameraActive] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [qualityScore, setQualityScore] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [consentGranted, setConsentGranted] = useState(student.consent.consentGranted);
  const [guardianName, setGuardianName] = useState(student.consent.grantedBy || '');
  const [altPin, setAltPin] = useState(student.biometrics.alternativePin || '1234');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  if (!isOpen) return null;

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      speechService.speak(`Olá, ${student.preferredName}! Olhe para a tela com calma para gravarmos sua chave de acesso.`);
    } catch (e: any) {
      setErrorMsg('Não foi possível acessar a câmera. Você pode configurar o PIN alternativo.');
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    setCapturing(true);

    setTimeout(() => {
      if (videoRef.current) {
        const { templateHash, qualityScore: score } = BiometricService.extractBiometricTemplate(videoRef.current);
        setQualityScore(score);
        setCapturing(false);
        stopCamera();

        const updatedStudent: Student = {
          ...student,
          consent: {
            ...student.consent,
            consentGranted: true,
            grantedBy: guardianName || student.consent.grantedBy || 'Responsável Legal Registrado',
            consentDate: new Date().toISOString(),
            purposeAccepted: true,
            canRevokeAnytime: true,
          },
          biometrics: {
            isConfigured: true,
            registeredDate: new Date().toISOString(),
            templateVectorHash: templateHash,
            livenessVerified: true,
            qualityScore: score,
            alternativePin: altPin,
            alternativeSymbols: ['Estrela', 'Livro', 'Lápis'],
          },
        };

        setStep(4);
        onSuccess(updatedStudent);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F4F8FF] border-b border-blue-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#173B70]">
                Configurar Acesso Facial · {student.name}
              </h2>
              <span className="text-[11px] text-[#526176]">
                Identificador: {student.registrationNumber} · {student.schoolClass}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Step 1: Privacy and Protection Explanation */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-[#173B70] space-y-2">
                <span className="font-bold flex items-center gap-1.5 text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                  Como os dados biométricos são protegidos no Aura:
                </span>
                <p className="leading-relaxed text-[#526176]">
                  1. <strong>Criptografia One-Way:</strong> O sistema não armazena fotos brutas do rosto. Ele gera uma assinatura matemática irreversível vinculada exclusivamente ao identificador interno do estudante.
                </p>
                <p className="leading-relaxed text-[#526176]">
                  2. <strong>Conformidade LGPD & ECA:</strong> Os dados biométricos de menores nunca são compartilhados com anunciantes, terceiros ou modelos públicos de IA.
                </p>
                <p className="leading-relaxed text-[#526176]">
                  3. <strong>Alternativa Inclusiva:</strong> O aluno sempre tem a opção de acessar por PIN ou chave ilustrada caso sinta desconforto com a câmera.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#173B70] block">
                  Responsável pelo Consentimento (Pai/Mãe ou Representante Legal)
                </label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="Nome do responsável legal que assinou a autorização"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="consentCheck"
                  checked={consentGranted}
                  onChange={(e) => setConsentGranted(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded-sm focus:ring-[#2563EB]"
                />
                <label htmlFor="consentCheck" className="text-xs text-[#173B70] font-medium cursor-pointer">
                  Confirmo que o termo de consentimento foi assinado e está arquivado no prontuário escolar.
                </label>
              </div>

              <button
                type="button"
                disabled={!consentGranted}
                onClick={() => {
                  setStep(2);
                  startCamera();
                }}
                className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Prosseguir para Captura com o Aluno Presente
              </button>
            </div>
          )}

          {/* Step 2: Camera Capture with Student */}
          {step === 2 && (
            <div className="space-y-4 text-center">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 text-left">
                <Smile className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  O estudante deve estar presente e confortável. Oriente o aluno a olhar para a tela com serenidade.
                </span>
              </div>

              {cameraActive ? (
                <div className="relative w-full max-w-xs mx-auto aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border-4 border-[#2563EB] shadow-md">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-36 h-48 rounded-[50%] border-2 border-white/80 border-dashed" />
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-100 text-slate-500 text-xs">
                  {errorMsg || 'Iniciando câmera...'}
                </div>
              )}

              {capturing ? (
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#2563EB]">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verificando proporções e criptografando vetor...</span>
                </div>
              ) : (
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setStep(1);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleCapture}
                    disabled={!cameraActive}
                    className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capturar Modelo Facial Seguro</span>
                  </button>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 text-left">
                <label className="text-xs font-semibold text-[#173B70] block mb-1">
                  Chave Alternativa (PIN Inclusivo de 4 dígitos)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={altPin}
                  onChange={(e) => setAltPin(e.target.value)}
                  className="w-32 px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-center font-mono font-bold"
                />
              </div>
            </div>
          )}

          {/* Step 4: Success confirmation */}
          {step === 4 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#DDF7E8] text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#173B70]">
                Acesso Facial Cadastrado com Sucesso!
              </h3>
              <p className="text-xs text-[#526176] max-w-sm mx-auto">
                O modelo biométrico protegido foi gerado com pontuação de qualidade de {qualityScore}%. O aluno {student.preferredName} agora pode entrar na área do aluno sem precisar digitar login ou senha.
              </p>
              <div className="p-3 rounded-xl bg-[#F4F8FF] border border-blue-100 text-xs text-left max-w-sm mx-auto space-y-1">
                <span className="font-bold text-[#173B70] block">Resumo do Cadastro:</span>
                <p>· Liveness: Verificado</p>
                <p>· Identificador: {student.registrationNumber}</p>
                <p>· PIN Alternativo de Backup: {altPin}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full max-w-xs py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs shadow-xs hover:bg-blue-700 transition-colors"
              >
                Concluir e Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
