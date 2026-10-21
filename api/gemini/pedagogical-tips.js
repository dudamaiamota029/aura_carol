import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { studentName, attempts, completedCount, struggleTopic } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      recommendations: [
        'Oferecer previsibilidade visual na transição entre atividades de finanças e planejamento.',
        'Ativar o narrador em áudio para enunciados com vocabulário técnico de administração.',
        'Estimular o uso da letra bastão ou cursiva conforme a preferência de conforto do estudante.',
        'Reconhecer verbalmente cada pequeno avanço com mensagens tranquilas.',
      ],
      supportLevelAdvice: 'Mantenha o foco em 1 instrução visual direta por tela.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Você é o orientador pedagógico do Aura (TEA e TDAH na disciplina de Administração).
Gere recomendações pedagógicas humanizadas e acolhedoras para o professor do aluno:
- Aluno: ${studentName || 'Estudante'}
- Atividades concluídas: ${completedCount || 0}
- Tentativas registradas: ${attempts || 1}
- Tema com maior desafio: ${struggleTopic || 'Geral'}

Retorne OBRIGATORIAMENTE um JSON puro com:
{
  "recommendations": ["Recomendação 1...", "Recomendação 2...", "Recomendação 3...", "Recomendação 4..."],
  "supportLevelAdvice": "Orientação de apoio pedagógico e sensorial concisa"
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
    console.error('Erro no endpoint serverless Gemini Tips:', error);
    return res.status(200).json({
      recommendations: [
        'Oferecer previsibilidade visual na transição entre atividades.',
        'Ativar o narrador em áudio para apoiar a leitura.',
        'Oferecer pausas voluntárias entre as etapas.',
      ],
      supportLevelAdvice: 'Apoio focado em conforto sensorial e redução de sobrecarga.',
    });
  }
}
