import { Student, Activity, Teacher, AuditLogItem } from '../types';

export const INITIAL_TEACHER: Teacher = {
  id: 'teacher-prof-marina',
  name: 'Prof.ª Marina Albuquerque',
  email: 'marina.albuquerque@escola.edu.br',
  schoolName: 'Escola Técnica Estadual de Gestão & Inovação',
  department: 'Coordenação Pedagógica & Práticas Inclusivas',
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'aura-std-001',
    name: 'Lucas Henrique Silva',
    preferredName: 'Lucas',
    registrationNumber: 'ADM-2026-081',
    schoolClass: '1º Ano Técnico - Turma A',
    schoolYear: 'Ensino Médio Técnico em Administração',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Lucas&backgroundColor=dbeafe',
    supportLevel: '1',
    preferences: {
      fontChoice: 'bastao',
      fontSize: 'lg',
      letterSpacing: 'wide',
      lineHeight: 'relaxed',
      highContrast: false,
      highlightMainInstruction: true,
      reduceMotion: false,
      enableAudioNarrator: true,
      soundFeedback: true,
      hideSecondaryDetails: false,
      calmPacing: true,
    },
    biometrics: {
      isConfigured: true,
      registeredDate: '2026-03-10T14:30:00Z',
      templateVectorHash: 'geo_mesh_hash_lucas_77a98c',
      livenessVerified: true,
      qualityScore: 96,
      alternativePin: '1234',
      alternativeSymbols: ['Estrela', 'Lápis', 'Livro'],
    },
    consent: {
      consentGranted: true,
      grantedBy: 'Cláudia Silva (Mãe / Responsável Legal)',
      relationship: 'pai_mae',
      consentDate: '2026-03-09T10:00:00Z',
      purposeAccepted: true,
      canRevokeAnytime: true,
    },
    completedActivityIds: ['act-adm-01'],
    inProgressActivityId: 'act-adm-02',
    skillMastery: {
      organizacaoRotina: 85,
      trabalhoEquipe: 90,
      autonomiaMetas: 75,
      comunicacaoEmpatica: 80,
      financasCotidiano: 70,
    },
    totalStars: 18,
    peacefulFocusMinutes: 45,
    needsPedagogicalSupport: false,
    restrictedClinicalNotes: 'TEA Nível 1. Excelente raciocínio lógico em categorização e organização visual. Prefere instruções com letra bastão e uma tarefa por tela.',
  },
  {
    id: 'aura-std-002',
    name: 'Beatriz Vasconcelos',
    preferredName: 'Bia',
    registrationNumber: 'ADM-2026-092',
    schoolClass: '1º Ano Técnico - Turma A',
    schoolYear: 'Ensino Médio Técnico em Administração',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Beatriz&backgroundColor=dbeafe',
    supportLevel: '2',
    preferences: {
      fontChoice: 'cursiva',
      fontSize: 'xl',
      letterSpacing: 'wider',
      lineHeight: 'loose',
      highContrast: false,
      highlightMainInstruction: true,
      reduceMotion: true,
      enableAudioNarrator: true,
      soundFeedback: false,
      hideSecondaryDetails: true,
      calmPacing: true,
    },
    biometrics: {
      isConfigured: true,
      registeredDate: '2026-03-12T11:15:00Z',
      templateVectorHash: 'geo_mesh_hash_bia_91f4b2',
      livenessVerified: true,
      qualityScore: 92,
      alternativePin: '4321',
      alternativeSymbols: ['Sol', 'Mochila', 'Caderno'],
    },
    consent: {
      consentGranted: true,
      grantedBy: 'Roberto Vasconcelos (Pai)',
      relationship: 'pai_mae',
      consentDate: '2026-03-11T16:20:00Z',
      purposeAccepted: true,
      canRevokeAnytime: true,
    },
    completedActivityIds: [],
    inProgressActivityId: 'act-adm-01',
    skillMastery: {
      organizacaoRotina: 60,
      trabalhoEquipe: 65,
      autonomiaMetas: 55,
      comunicacaoEmpatica: 60,
      financasCotidiano: 50,
    },
    totalStars: 9,
    peacefulFocusMinutes: 30,
    needsPedagogicalSupport: true,
    supportReason: 'Sentiu sobrecarga em textos com mais de duas frases. Sugestão: reforçar o áudio narrador e letra cursiva ampliada.',
    restrictedClinicalNotes: 'TEA Nível 2 com hipersensibilidade a sons abruptos e estímulos visuais rápidos. Beneficia-se muito do modo sem sons e pausas tranquilas.',
  },
  {
    id: 'aura-std-003',
    name: 'Gabriel Menezes',
    preferredName: 'Gabi',
    registrationNumber: 'ADM-2026-104',
    schoolClass: '1º Ano Técnico - Turma B',
    schoolYear: 'Ensino Médio Técnico em Administração',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gabriel&backgroundColor=dbeafe',
    supportLevel: '1',
    preferences: {
      fontChoice: 'legivel',
      fontSize: 'md',
      letterSpacing: 'normal',
      lineHeight: 'normal',
      highContrast: false,
      highlightMainInstruction: false,
      reduceMotion: false,
      enableAudioNarrator: false,
      soundFeedback: true,
      hideSecondaryDetails: false,
      calmPacing: false,
    },
    biometrics: {
      isConfigured: false,
      registeredDate: undefined,
      livenessVerified: false,
      qualityScore: 0,
      alternativePin: '7788',
      alternativeSymbols: ['Livro', 'Lápis', 'Estrela'],
    },
    consent: {
      consentGranted: true,
      grantedBy: 'Helena Menezes (Mãe)',
      relationship: 'pai_mae',
      consentDate: '2026-03-15T09:40:00Z',
      purposeAccepted: true,
      canRevokeAnytime: true,
    },
    completedActivityIds: ['act-adm-01', 'act-adm-02', 'act-adm-03'],
    inProgressActivityId: 'act-adm-04',
    skillMastery: {
      organizacaoRotina: 95,
      trabalhoEquipe: 90,
      autonomiaMetas: 92,
      comunicacaoEmpatica: 88,
      financasCotidiano: 85,
    },
    totalStars: 27,
    peacefulFocusMinutes: 70,
    needsPedagogicalSupport: false,
    restrictedClinicalNotes: 'TDAH combinado. Excelente engajamento com objetivos em etapas claras e desafios interativos rápidos.',
  },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-adm-01',
    title: 'Organizando Minha Rotina Escolar',
    topic: 'Rotina Escolar & Organização',
    discipline: 'Práticas Educacionais Inclusivas',
    description: 'Atividade elaborada para apoiar a organização da mochila, dos horários e dos materiais escolares com tranquilidade e autonomia.',
    targetSupportLevel: 'ambos',
    estimatedMinutes: 6,
    coverImageUrl: '/src/assets/images/hero_aura_learning_1792536855995.jpg',
    adaptiveAiAssistanceEnabled: true,
    createdByTeacherId: 'teacher-prof-marina',
    createdAt: '2026-03-01T10:00:00Z',
    steps: [
      {
        stepNumber: 1,
        title: 'Etapa 1: Preparando a Mochila com Calma',
        mainInstruction: 'Amanhã temos aula e queremos deixar tudo pronto sem correria. O que é mais tranquilo fazer hoje à noite?',
        supportText: 'Organizar as coisas com antecedência evita a pressa e o estresse matinal.',
        vocabularyCard: {
          term: 'Rotina Visual',
          definition: 'Uma sequência de passos com imagens ou lista simples para não esquecer nada.',
          example: 'Olhar o quadro de horários antes de colocar os cadernos na mochila.',
        },
        type: 'multipla_escolha',
        hint: 'Fazer as coisas com tempo ajuda a mente a relaxar.',
        options: [
          {
            id: 'opt-1a',
            label: 'Deixar tudo espalhado e arrumar correndo minutos antes de sair',
            isCorrect: false,
            feedbackText: 'Arrumar na correria pode gerar ansiedade. Vamos tentar a outra alternativa?',
          },
          {
            id: 'opt-1b',
            label: 'Conferir o horário das aulas e separar os cadernos necessários no seu tempo',
            isCorrect: true,
            feedbackText: 'Muito bem! Essa organização traz segurança e tranquilidade para o seu dia.',
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Etapa 2: Separando Recursos e Materiais',
        mainInstruction: 'Você vai fazer um desenho para o projeto de inclusão. Associe o material correto:',
        supportText: 'Saber onde cada material fica guardado ajuda a manter a concentração.',
        type: 'cenario_decisao',
        hint: 'Lápis de cor e papel são ferramentas essenciais para desenhar.',
        options: [
          {
            id: 'opt-2a',
            label: 'Estojo com lápis e régua = Materiais de uso imediato na mesa',
            isCorrect: true,
            feedbackText: 'Perfeito! Deixar à mão apenas o que vai usar ajuda no foco e evita excesso de estímulos.',
          },
          {
            id: 'opt-2b',
            label: 'Todos os brinquedos e livros de outras matérias espalhados na mesa',
            isCorrect: false,
            feedbackText: 'Muitos objetos juntos podem distrair. Uma mesa limpa traz conforto.',
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Etapa 3: Minha Sequência de Sucesso',
        mainInstruction: 'Ordene os passos de uma rotina agradável de estudos:',
        supportText: 'Pequenas etapas organizadas tornam qualquer tarefa mais simples.',
        type: 'organizacao_etapas',
        hint: 'Primeiro olhamos a tarefa, depois preparamos o ambiente e fazemos pausas quando necessário.',
        expectedSequence: ['1. Escolher um cantinho calmo', '2. Separar apenas os materiais da atividade', '3. Realizar a tarefa no seu ritmo', '4. Fazer uma pausa para relaxar'],
        options: [
          { id: 'seq-1', label: '1. Escolher um cantinho calmo', isCorrect: true, feedbackText: 'Passo 1 correto!' },
          { id: 'seq-2', label: '2. Separar apenas os materiais da atividade', isCorrect: true, feedbackText: 'Passo 2 correto!' },
          { id: 'seq-3', label: '3. Realizar a tarefa no seu ritmo', isCorrect: true, feedbackText: 'Passo 3 correto!' },
          { id: 'seq-4', label: '4. Fazer uma pausa para relaxar', isCorrect: true, feedbackText: 'Passo 4 correto!' },
        ],
      },
    ],
  },
  {
    id: 'act-adm-02',
    title: 'Pequenas Metas: Dividindo Tarefas Grandes',
    topic: 'Autonomia & Pequenas Metas',
    discipline: 'Práticas Educacionais Inclusivas',
    description: 'Aprenda como dividir trabalhos grandes em pedacinhos fáceis de completar, respeitando a sua energia.',
    targetSupportLevel: 'ambos',
    estimatedMinutes: 5,
    adaptiveAiAssistanceEnabled: true,
    createdByTeacherId: 'teacher-prof-marina',
    createdAt: '2026-03-05T14:00:00Z',
    steps: [
      {
        stepNumber: 1,
        title: 'Etapa 1: Um Passo de Cada Vez',
        mainInstruction: 'Você tem um trabalho de pesquisa para entregar em 5 dias. Qual é a melhor estratégia?',
        supportText: 'Quando dividimos um trabalho grande em partes menores, ele fica muito mais leve.',
        vocabularyCard: {
          term: 'Pequenas Metas',
          definition: 'Dividir uma tarefa em partes menores e realizar uma por dia.',
          example: 'Ler 2 páginas hoje e fazer um desenho amanhã.',
        },
        type: 'multipla_escolha',
        hint: 'Pequenos passos constantes trazem paz e confiança.',
        options: [
          {
            id: 'meta-opt-1',
            label: 'Fazer um pouquinho a cada dia com tranquilidade',
            isCorrect: true,
            feedbackText: 'Excelente! Essa estratégia garante que você aprenda sem se cansar.',
          },
          {
            id: 'meta-opt-2',
            label: 'Deixar tudo para a última hora sem descanso',
            isCorrect: false,
            feedbackText: 'Fazer tudo de uma vez cansa muito. Dividir em pedacinhos é o segredo do sucesso!',
          },
        ],
      },
    ],
  },
  {
    id: 'act-adm-03',
    title: 'Trabalho em Equipe e Escuta Acolhedora',
    topic: 'Trabalho em Equipe & Empatia',
    discipline: 'Práticas Educacionais Inclusivas',
    description: 'Como colaborar respeitando o estilo de cada colega, valorizando a comunicação gentil e a empatia.',
    targetSupportLevel: 'ambos',
    estimatedMinutes: 6,
    adaptiveAiAssistanceEnabled: true,
    createdByTeacherId: 'teacher-prof-marina',
    createdAt: '2026-03-08T09:30:00Z',
    steps: [
      {
        stepNumber: 1,
        title: 'Etapa 1: Respeitando as Diferenças no Grupo',
        mainInstruction: 'Em uma atividade coletiva, um colega prefere organizar as fichas em silêncio. Como podemos apoiar?',
        supportText: 'Cada pessoa tem talentos e formas diferentes de colaborar.',
        vocabularyCard: {
          term: 'Empatia',
          definition: 'Compreender o sentimento do outro e respeitar a forma como ele se sente bem.',
          example: 'Oferecer um espaço silencioso para quem não gosta de barulho alto.',
        },
        type: 'multipla_escolha',
        hint: 'Acolher a necessidade do colega fortalece a amizade e o trabalho em equipe.',
        options: [
          {
            id: 'lid-opt-1',
            label: 'Respeitar o silêncio dele e combinar como ele quer entregar a parte dele',
            isCorrect: true,
            feedbackText: 'Atitude linda e empática! Essa é a essência da convivência inclusiva.',
          },
          {
            id: 'lid-opt-2',
            label: 'Insistir para que ele fique em um lugar com muito barulho',
            isCorrect: false,
            feedbackText: 'Lugares barulhentos podem incomodar. Respeitar o espaço do colega é sempre o melhor caminho.',
          },
        ],
      },
    ],
  },
  {
    id: 'act-adm-04',
    title: 'Cuidando dos Nossos Recursos e Finanças',
    topic: 'Educação Financeira do Dia a Dia',
    discipline: 'Práticas Educacionais Inclusivas',
    description: 'Entenda como administrar seus recursos, materiais e pequenas economias de maneira simples e prática.',
    targetSupportLevel: 'ambos',
    estimatedMinutes: 7,
    adaptiveAiAssistanceEnabled: true,
    createdByTeacherId: 'teacher-prof-marina',
    createdAt: '2026-03-14T15:00:00Z',
    steps: [
      {
        stepNumber: 1,
        title: 'Etapa 1: Cuidar Bem dos Materiais',
        mainInstruction: 'Ao final da aula, sobrou papel e tinta do projeto escolar. O que é mais responsável fazer?',
        supportText: 'Evitar desperdício é uma forma inteligente de cuidar dos recursos coletivos.',
        vocabularyCard: {
          term: 'Gestão de Recursos',
          definition: 'Cuidar com carinho daquilo que temos para que dure mais tempo e sirva a todos.',
          example: 'Tampar as canetinhas e guardar o papel em uma pasta limpa.',
        },
        type: 'multipla_escolha',
        hint: 'Guardar os materiais limpos permite que eles sejam usados novamente.',
        options: [
          {
            id: 'fin-opt-1',
            label: 'Guardar na pasta organizada para utilizar no próximo projeto',
            isCorrect: true,
            feedbackText: 'Certíssimo! Cuidar dos recursos é uma grande virtude desenvolvida no nosso projeto.',
          },
          {
            id: 'fin-opt-2',
            label: 'Jogar tudo no lixo mesmo estando novinho',
            isCorrect: false,
            feedbackText: 'Materiais bons podem ser reaproveitados. Vamos valorizar nossos recursos!',
          },
        ],
      },
    ],
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-01',
    timestamp: '2026-03-12T11:15:00Z',
    action: 'Cadastro de Biometria Facial Realizado',
    actor: 'Prof.ª Marina Albuquerque',
    targetStudentId: 'aura-std-002',
    category: 'biometria',
    details: 'Modelo vetorial gerado sob consentimento prévio do responsável legal. Liveness verificado com sucesso.',
  },
  {
    id: 'log-02',
    timestamp: '2026-03-15T09:40:00Z',
    action: 'Consentimento LGPD Registrado',
    actor: 'Secretaria Acadêmica / Prof.ª Marina',
    targetStudentId: 'aura-std-003',
    category: 'consentimento',
    details: 'Termo de autorização para plataforma pedagógica inclusiva assinado por Helena Menezes.',
  },
  {
    id: 'log-03',
    timestamp: '2026-03-18T14:22:00Z',
    action: 'Atualização de Preferência de Leitura',
    actor: 'Lucas Henrique Silva (Aluno)',
    targetStudentId: 'aura-std-001',
    category: 'preferencias',
    details: 'Alteração para letra bastão com espaçamento ampliado e áudio-leitor ativo.',
  },
];

const STORAGE_KEYS = {
  STUDENTS: 'aura_students_data_v2',
  ACTIVITIES: 'aura_activities_data_v2',
  TEACHER: 'aura_teacher_data_v2',
  AUDIT_LOGS: 'aura_audit_logs_v2',
};

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_STUDENTS;
  }
}

export function saveStoredStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students to localStorage', e);
  }
}

export function getStoredActivities(): Activity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_ACTIVITIES;
  }
}

export function saveStoredActivities(activities: Activity[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (e) {
    console.error('Failed to save activities to localStorage', e);
  }
}

export function getStoredAuditLogs(): AuditLogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_AUDIT_LOGS;
  }
}

export function addAuditLog(entry: Omit<AuditLogItem, 'id' | 'timestamp'>): void {
  const current = getStoredAuditLogs();
  const newLog: AuditLogItem = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  const updated = [newLog, ...current];
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to append audit log', e);
  }
}
