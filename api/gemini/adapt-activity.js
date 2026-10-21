import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { activityTitle, originalInstructions, targetNeed, studentLevel, topic } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Retorno fallback quando a chave ainda não foi informada
    return res.status(200).json({
      simplifiedInstructions: `Instrução Adaptada: 1. Leia uma frase de cada vez sobre ${topic || 'Administração'}. 2. Observe os recursos necessários. 3. Marque a alternativa correta sem pressa.`,
      brokenDownSteps: [
        'Passo 1: Identificar o objetivo central com calma.',
        'Passo 2: Separar os materiais necessários.',
        'Passo 3: Conferir com o apoio da rotina visual.',
      ],
      concreteExample: 'Exemplo prático: Organizar uma mesa de trabalho é como arrumar a mochila antes da aula.',
      reviewQuestion: 'Qual etapa traz mais tranquilidade para começar a tarefa?',
      vocabularySupport: [
        { term: 'Planejar', definition: 'Pensar e anotar tudo antes de agir para evitar imprevistos.' },
        { term: 'Equipe', definition: 'Grupo de pessoas que colaboram juntas para alcançar um objetivo comum.' },
      ],
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Você é o assistente pedagógico especializado do Aura, uma plataforma de aprendizagem inclusiva para estudantes com TEA (Níveis 1 e 2), TDAH e dificuldades de leitura.
O foco é a disciplina de Administração Escolar e Práticas Inclusivas.
Adapte a seguinte instrução de atividade:
- Título da Atividade: ${activityTitle || 'Atividade de Administração'}
- Tema: ${topic || 'Organização e Gestão'}
- Instrução Original: ${originalInstructions || ''}
- Nível de Suporte TEA: Nível ${studentLevel || '1 e 2'}
- Necessidade específica: ${targetNeed || 'Dificuldade de leitura e necessidade de previsibilidade sensorial'}

Retorne OBRIGATORIAMENTE um JSON puro com este formato:
{
  "simplifiedInstructions": "Instrução clara, direta, em frases curtas e acolhedoras",
  "brokenDownSteps": ["Passo 1...", "Passo 2...", "Passo 3..."],
  "concreteExample": "Um exemplo prático e tangível da vida cotidiana ou da escola",
  "reviewQuestion": "Uma pergunta reflexiva curta e não ameaçadora",
  "vocabularySupport": [{"term": "Palavra", "definition": "Definição simples e clara"}]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    return res.status(200).json(JSON.parse(text));
  } catch (error) {
    console.error('Erro no endpoint serverless Gemini:', error);
    return res.status(200).json({
      simplifiedInstructions: `Instrução Adaptada: 1. Leia com calma. 2. Identifique o objetivo. 3. Conclua no seu ritmo.`,
      brokenDownSteps: ['Passo 1: Respiração e foco.', 'Passo 2: Executar a etapa.', 'Passo 3: Celebrar a conquista.'],
      concreteExample: 'Planejar nos ajuda a ter clareza e paz no dia a dia.',
      reviewQuestion: 'Tudo pronto para continuarmos juntos?',
      vocabularySupport: [{ term: 'Foco', definition: 'Atenção dedicada a uma coisa de cada vez.' }],
    });
  }
}
