import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Endpoint: AI Pedagogical Activity Adapter for Administration
app.post('/api/gemini/adapt-activity', async (req: Request, res: Response) => {
  try {
    const { activityTitle, originalInstructions, targetNeed, studentLevel, topic } = req.body;

    if (!ai) {
      // Fallback pedagogical adaptation if API key is not yet configured
      return res.json({
        simplifiedInstructions: `Passo a Passo Simplificado: \n1. Leia uma frase de cada vez sobre ${topic || 'Administração'}.\n2. Observe as imagens de apoio.\n3. Selecione a opção que organiza melhor os recursos.`,
        brokenDownSteps: [
          'Passo 1: Identificar qual é o objetivo principal.',
          'Passo 2: Separar os recursos necessários (tempo, pessoas e materiais).',
          'Passo 3: Conferir o resultado com calma.',
        ],
        concreteExample: 'Exemplo: Se você vai organizar uma festa de aniversário, planejar é fazer a lista de convidados e compras com antecedência.',
        reviewQuestion: 'Qual é o primeiro passo de um administrador antes de começar a trabalhar?',
        vocabularySupport: [
          { term: 'Planejamento', definition: 'Pensar e anotar o que precisa ser feito antes de começar.' },
          { term: 'Recursos', definition: 'Tudo o que usamos para fazer um trabalho: tempo, dinheiro e materiais.' },
        ],
      });
    }

    const prompt = `Você é o Agente Educacional Especialista do Aura, uma plataforma adaptativa idealizada pela Turma de Administração para inclusão de estudantes com TEA (Níveis 1 e 2) e TDAH.
Atividade: "${activityTitle}"
Tópico: "${topic}"
Instruções originais: "${originalInstructions}"
Necessidade específica: "${targetNeed || 'Linguagem direta, redução de sobrecarga sensorial e etapas curtas'}"
Nível de suporte: "${studentLevel || 'Nível 1'}"

Diretrizes obrigatórias:
- Não infantilizar o estudante.
- Linguagem clara, objetiva, concreta e acolhedora.
- Dividir em pequenos passos sequenciais.
- Dar um exemplo prático do cotidiano escolar (ex: rotina de estudos, cooperação em grupo com respeito mútuo, pequenas metas, cuidados com materiais).
- Fornecer mini-glossário com 2 termos explicados de forma simples.
- Não inferir diagnósticos médicos fixos.

Responda em formato JSON estrito com o esquema:
{
  "simplifiedInstructions": "string",
  "brokenDownSteps": ["string", "string", "string"],
  "concreteExample": "string",
  "reviewQuestion": "string",
  "vocabularySupport": [{"term": "string", "definition": "string"}]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating AI adaptation:', error?.message);
    return res.status(500).json({
      error: 'Não foi possível processar a adaptação com IA no momento.',
      fallbackInstructions: 'Divida o enunciado em 3 passos curtos e utilize cartões visuais para apoiar a compreensão do tema de administração.',
    });
  }
});

// 2. Endpoint: Pedagogical recommendations based on student progress
app.post('/api/gemini/pedagogical-tips', async (req: Request, res: Response) => {
  try {
    const { studentName, attempts, completedCount, struggleTopic } = req.body;

    if (!ai) {
      return res.json({
        recommendations: [
          `Ofereça rotina visual reforçada para ${struggleTopic || 'Planejamento e Orçamento'}.`,
          'Permita pausas sensoriais a cada 10 minutos de atividade.',
          'Utilize a alternância para letra bastão ou aumento de espaçamento entre linhas.',
          'Reforce com elogios descritivos (ex: "Você organizou muito bem as etapas deste projeto!").',
        ],
        supportLevelAdvice: 'Mantenha atividades de administração com apoio em 1 instrução focal por tela.',
      });
    }

    const prompt = `Como psicopedagogo orientador do projeto de inclusão escolar da Turma de Administração:
Estudante: ${studentName || 'Estudante'}
Atividades concluídas: ${completedCount || 3}
Tema com maior número de pausas/dúvidas: ${struggleTopic || 'Rotinas e Organização'}
Tentativas médias: ${attempts || 2}

Forneça 4 recomendações pedagógicas acolhedoras, éticas e explicáveis para o professor apoiar este estudante.
Sem rótulos negativos e sem presumir incapacidade.
Responda em JSON:
{
  "recommendations": ["string", "string", "string", "string"],
  "supportLevelAdvice": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating tips:', error?.message);
    return res.status(500).json({
      recommendations: [
        'Ajuste o tempo de resposta e priorize perguntas com alternativas visuais.',
        'Estimule o aluno a usar a ferramenta "Escolher como quero ler" para maior conforto.',
      ],
      supportLevelAdvice: 'Apoio pedagógico com reforço positivo contínuo.',
    });
  }
});

// Start server with Vite middleware in dev or static in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aura Educational Platform listening on port ${PORT}`);
  });
}

startServer();
