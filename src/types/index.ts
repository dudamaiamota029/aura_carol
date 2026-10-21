export type FontChoice = 'cursiva' | 'bastao' | 'legivel' | 'padrao';
export type FontSizeChoice = 'sm' | 'md' | 'lg' | 'xl';
export type LineHeightChoice = 'normal' | 'relaxed' | 'loose';
export type LetterSpacingChoice = 'normal' | 'wide' | 'wider';
export type SpacingChoice = LineHeightChoice;

export interface AccessibilityPreferences {
  fontChoice: FontChoice;
  fontSize: FontSizeChoice;
  letterSpacing: LetterSpacingChoice;
  lineHeight: LineHeightChoice;
  highContrast: boolean;
  highlightMainInstruction: boolean;
  reduceMotion: boolean;
  enableAudioNarrator: boolean;
  soundFeedback: boolean;
  hideSecondaryDetails: boolean;
  calmPacing: boolean;
}

export interface BiometricConsent {
  consentGranted: boolean;
  grantedBy: string;
  relationship: 'pai_mae' | 'responsavel_legal' | 'coordenacao';
  consentDate: string;
  purposeAccepted: boolean;
  canRevokeAnytime: boolean;
}

export interface BiometricRecord {
  isConfigured: boolean;
  registeredDate?: string;
  templateVectorHash?: string; // One-way cryptographic hash of facial landmark geometric ratios
  livenessVerified: boolean;
  qualityScore: number; // 0 - 100
  alternativePin: string; // Accessible fallback PIN (e.g., '1234' or visual symbols)
  alternativeSymbols?: string[]; // e.g. ['Estrela', 'Livro', 'Lápis']
}

export interface Student {
  id: string;
  name: string;
  preferredName: string;
  registrationNumber: string; // Identificador interno
  schoolClass: string; // Turma (ex: "1º Ano Técnico - Turma A")
  schoolYear: string; // "Ensino Médio Integrado em Administração"
  avatarUrl: string;
  supportLevel: '1' | '2';
  preferences: AccessibilityPreferences;
  biometrics: BiometricRecord;
  consent: BiometricConsent;
  // Progress in Business Administration
  completedActivityIds: string[];
  inProgressActivityId?: string;
  skillMastery: {
    organizacaoRotina: number; // 0-100%
    trabalhoEquipe: number;
    autonomiaMetas: number;
    comunicacaoEmpatica: number;
    financasCotidiano: number;
  };
  totalStars: number;
  peacefulFocusMinutes: number;
  needsPedagogicalSupport: boolean;
  supportReason?: string;
  restrictedClinicalNotes?: string; // Accessible only to authorized staff
}

export type ActivityType = 
  | 'multipla_escolha'
  | 'associacao_imagem_palavra'
  | 'organizacao_etapas'
  | 'completar_frases'
  | 'cenario_decisao';

export interface StepOption {
  id: string;
  label: string;
  imageUrl?: string;
  isCorrect?: boolean;
  feedbackText: string;
}

export interface ActivityStep {
  stepNumber: number;
  title: string;
  mainInstruction: string;
  supportText?: string;
  imageUrl?: string;
  vocabularyCard?: {
    term: string;
    definition: string;
    example: string;
  };
  type: ActivityType;
  options: StepOption[];
  expectedSequence?: string[]; // for organizacao_etapas
  hint: string;
}

export type InclusiveTopic = 
  | 'Rotina Escolar & Organização' 
  | 'Trabalho em Equipe & Empatia' 
  | 'Autonomia & Pequenas Metas' 
  | 'Educação Financeira do Dia a Dia';

export interface Activity {
  id: string;
  title: string;
  topic: InclusiveTopic;
  discipline: string; // e.g. "Administração & Práticas Inclusivas"
  description: string;
  targetSupportLevel: '1' | '2' | 'ambos';
  estimatedMinutes: number;
  coverImageUrl?: string;
  steps: ActivityStep[];
  adaptiveAiAssistanceEnabled: boolean;
  createdByTeacherId: string;
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  schoolName: string;
  department: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  targetStudentId?: string;
  category: 'biometria' | 'acesso' | 'preferencias' | 'consentimento';
  details: string;
}
