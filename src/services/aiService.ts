export interface AiAdaptationResponse {
  simplifiedInstructions: string;
  brokenDownSteps: string[];
  concreteExample: string;
  reviewQuestion: string;
  vocabularySupport: Array<{ term: string; definition: string }>;
}

export interface AiPedagogicalTipsResponse {
  recommendations: string[];
  supportLevelAdvice: string;
}

export class AiService {
  static async adaptAdministrationActivity(params: {
    activityTitle: string;
    originalInstructions: string;
    targetNeed?: string;
    studentLevel?: '1' | '2';
    topic?: string;
  }): Promise<AiAdaptationResponse> {
    try {
      const response = await fetch('/api/gemini/adapt-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('Using client fallback adaptation:', err);
      return {
        simplifiedInstructions: `Instrução Adaptada: 1. Leia uma frase de cada vez sobre ${params.topic || 'Administração'}. 2. Observe os recursos necessários. 3. Marque a alternativa correta sem pressa.`,
        brokenDownSteps: [
          'Passo 1: Identificar a meta principal do projeto.',
          'Passo 2: Reconhecer os recursos materiais e humanos.',
          'Passo 3: Conferir com o apoio da rotina visual.',
        ],
        concreteExample: 'Exemplo: Se você vai abrir uma barraca de sucos, planejar é anotar as frutas e o dinheiro antes de abrir.',
        reviewQuestion: 'O que o administrador faz primeiro: planeja ou começa sem saber o que fazer?',
        vocabularySupport: [
          { term: 'Planejar', definition: 'Pensar e anotar tudo antes de agir para evitar imprevistos.' },
          { term: 'Equipe', definition: 'Grupo de pessoas que colaboram juntas para alcançar um objetivo comum.' },
        ],
      };
    }
  }

  static async getPedagogicalRecommendations(params: {
    studentName: string;
    attempts: number;
    completedCount: number;
    struggleTopic?: string;
  }): Promise<AiPedagogicalTipsResponse> {
    try {
      const response = await fetch('/api/gemini/pedagogical-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Falha no servidor');
      }

      return await response.json();
    } catch (err) {
      return {
        recommendations: [
          'Oferecer previsibilidade visual na transição entre atividades de finanças e planejamento.',
          'Ativar o narrador em áudio para enunciados com vocabulário técnico de administração.',
          'Estimular o uso da letra bastão ou cursiva conforme a preferência de conforto do estudante.',
          'Reconhecer verbalmente cada pequeno avanço com mensagens tranquilas.',
        ],
        supportLevelAdvice: 'Mantenha o foco em 1 instrução visual direta por tela.',
      };
    }
  }
}
