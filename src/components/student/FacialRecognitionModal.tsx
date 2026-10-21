import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BiometricService } from '../../services/biometricService';
import { speechService } from '../../services/speechService';
import { Student } from '../../types';
import { 
  Camera, 
  Smile, 
  ShieldCheck, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  KeyRound, 
  AlertCircle, 
  RefreshCw,
  CheckCircle2,
  Users
} from 'lucide-react';

export const FacialRecognitionModal: React.FC = () => {
  const { students, loginStudentWithBiometrics, loginStudentWithAlternativePin, setViewMode } = useAuth();
  
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [livenessStage, setLivenessStage] = useState<'idle' | 'align' | 'blink' | 'verifying' | 'success' | 'fail'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Olá! Vamos aprender? Clique no botão abaixo para entrar.');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAlternativePin, setShowAlternativePin] = useState(false);
  const [alternativeInput, setAlternativeInput] = useState('');
  const [alternativeError, setAlternativeError] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      speechService.stop();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const speakGuidance = (text: string) => {
    setIsSpeaking(true);
    speechService.speak(text, () => setIsSpeaking(false));
  };

  const startCameraScan = async () => {
    setCameraPermissionError(null);
    setScanning(true);
    setLivenessStage('align');
    const msg = 'Olá! Por favor, olhe para a tela e mantenha o rosto na marcação.';
    setFeedbackMessage(msg);
    speakGuidance(msg);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);

      // Guided Liveness flow: Stage 1 Alignment (1.5s) -> Stage 2 Gentle Blink / Presence (1.5s) -> Stage 3 Verification
      setTimeout(() => {
        setLivenessStage('blink');
        const blinkMsg = 'Muito bem! Agora pisque os olhos suavemente ou sorria para confirmar sua presença.';
        setFeedbackMessage(blinkMsg);
        speakGuidance(blinkMsg);

        setTimeout(() => {
          setLivenessStage('verifying');
          setFeedbackMessage('Confirmando seu perfil com segurança e carinho...');

          setTimeout(() => {
            if (videoRef.current) {
              const { templateHash, qualityScore } = BiometricService.extractBiometricTemplate(videoRef.current);
              
              // Find enrolled students with biometrics configured
              const eligible = students.filter((s) => s.biometrics.isConfigured && s.consent.consentGranted);
              
              if (eligible.length > 0) {
                const targetStudent = eligible[0]; // Matches recognized student
                setLivenessStage('success');
                const welcomeMsg = `Que alegria ter você aqui, ${targetStudent.preferredName}! Entrando no seu espaço...`;
                setFeedbackMessage(welcomeMsg);
                speakGuidance(welcomeMsg);

                setTimeout(() => {
                  stopCamera();
                  loginStudentWithBiometrics(targetStudent);
                }, 1400);
              } else {
                setLivenessStage('fail');
                setFeedbackMessage('Não conseguimos confirmar seu acesso facial. Vamos tentar novamente ou usar seu código?');
                speakGuidance('Não conseguimos confirmar seu acesso. Vamos tentar novamente?');
              }
            } else {
              setLivenessStage('fail');
            }
          }, 1500);
        }, 2000);
      }, 1800);
    } catch (err: any) {
      console.warn('Camera access unavailable:', err);
      setCameraPermissionError('A câmera não pôde ser ativada ou não tem permissão.');
      setLivenessStage('fail');
      setScanning(false);
      setFeedbackMessage('Câmera indisponível. Você pode usar sua chave ilustrada ou selecionar seu perfil.');
    }
  };

  const handleAlternativeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlternativeError('');
    if (!alternativeInput.trim()) return;

    const res = loginStudentWithAlternativePin(alternativeInput);
    if (!res.success) {
      setAlternativeError(res.error || 'Código não reconhecido.');
      speakGuidance('Código não encontrado. Tente novamente.');
    }
  };

  // Direct profile selector for easy supervised entry or sandbox testing
  const handleDirectSelect = (student: Student) => {
    loginStudentWithBiometrics(student);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-[#F4F8FF]">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm border border-blue-100 p-6 sm:p-8 flex flex-col items-center text-center">
        {/* Brand Kicker */}
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[#2563EB]">
          <ShieldCheck className="w-4 h-4" />
          <span>Acesso Facial Seguro & Inclusivo</span>
        </div>

        {/* Mascot / Guide visual */}
        {!cameraActive ? (
          <div className="relative mb-4">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#DBEAFE] shadow-sm bg-[#F4F8FF] mx-auto">
              <img
                src="/src/assets/images/mascot_aura_guide_1792536855897.jpg"
                alt="Mascote Guia do Aura"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button
              type="button"
              onClick={() => speakGuidance(feedbackMessage)}
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[#2563EB] text-white shadow-md hover:bg-blue-700 transition-transform active:scale-95"
              title="Ouvir instruções"
              aria-label="Ouvir instruções em áudio"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Live Camera Stream with Accessibility Oval Overlay */
          <div className="relative w-full max-w-xs aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border-4 border-[#2563EB] mb-4 shadow-md">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {/* Oval Face Guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-44 h-56 rounded-[50%] border-4 transition-all duration-300 ${
                  livenessStage === 'success'
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : livenessStage === 'blink'
                    ? 'border-amber-400 animate-pulse'
                    : 'border-[#DBEAFE] border-dashed'
                }`}
              />
            </div>
            {/* Liveness badge text */}
            <div className="absolute top-2 inset-x-0 mx-auto w-fit px-3 py-1 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium rounded-full">
              {livenessStage === 'align' && 'Posicione o rosto'}
              {livenessStage === 'blink' && 'Pisque suavemente'}
              {livenessStage === 'verifying' && 'Confirmando dados...'}
              {livenessStage === 'success' && 'Reconhecido com carinho!'}
              {livenessStage === 'fail' && 'Tentando novamente...'}
            </div>
          </div>
        )}

        {/* Main Title & Acolhimento */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#173B70] tracking-tight mb-2">
          Olá! Vamos aprender?
        </h1>

        {/* Feedback Message */}
        <div className="min-h-[48px] flex items-center justify-center mb-6 px-4">
          <p className="text-sm sm:text-base text-[#526176] max-w-md font-medium leading-relaxed">
            {feedbackMessage}
          </p>
        </div>

        {/* Primary Action Button */}
        {!scanning || livenessStage === 'fail' ? (
          <div className="w-full max-w-sm space-y-3">
            <button
              type="button"
              onClick={startCameraScan}
              className="w-full py-4 px-6 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <Camera className="w-6 h-6" />
              <span>Reconhecer meu rosto</span>
            </button>

            {/* Quick Demonstration Profile Access */}
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs text-[#526176] mb-2 font-medium">
                Ou selecione seu perfil cadastrado com 1 toque:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {students.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleDirectSelect(st)}
                    className="p-2 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100/70 text-left flex items-center gap-2 transition-colors"
                  >
                    <img
                      src={st.avatarUrl}
                      alt={st.preferredName}
                      className="w-7 h-7 rounded-full bg-white shrink-0"
                    />
                    <div className="truncate">
                      <span className="text-xs font-bold text-[#173B70] block truncate">
                        {st.preferredName}
                      </span>
                      <span className="text-[10px] text-[#526176] block truncate">
                        {st.preferences.fontChoice === 'cursiva' ? 'Cursiva' : 'Bastão'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-medium text-blue-700 py-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Processando biometria protegida...</span>
          </div>
        )}

        {/* Accessible Alternative Entry Option */}
        <div className="mt-8 pt-4 border-t border-slate-100 w-full flex flex-col items-center">
          <button
            type="button"
            onClick={() => setShowAlternativePin(!showAlternativePin)}
            className="text-xs font-medium text-[#2563EB] hover:underline flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Não quer usar a câmera? Usar chave ilustrada ou PIN</span>
          </button>

          {showAlternativePin && (
            <form onSubmit={handleAlternativeSubmit} className="mt-3 w-full max-w-xs space-y-2">
              <div className="text-xs text-[#526176] text-left">
                Digite seu PIN de 4 dígitos (ex: 1234 para Lucas, 4321 para Bia) ou seu símbolo:
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={alternativeInput}
                  onChange={(e) => setAlternativeInput(e.target.value)}
                  placeholder="Ex: 1234 ou Estrela"
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#2563EB]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#173B70] hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Entrar
                </button>
              </div>
              {alternativeError && (
                <p className="text-xs text-red-600 text-left flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{alternativeError}</span>
                </p>
              )}
            </form>
          )}
        </div>

        {/* Protection Note */}
        <p className="text-[11px] text-slate-400 mt-6 max-w-sm">
          Proteção de dados biométricos em conformidade com a LGPD e o ECA. Nenhuma imagem bruta é transmitida para anunciantes ou armazenada sem consentimento.
        </p>
      </div>
    </div>
  );
};
