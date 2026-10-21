# Aura — Plataforma Educacional Adaptativa e Inclusiva

O **Aura** é uma plataforma educacional de aprendizagem adaptativa desenvolvida com foco em acessibilidade e acolhimento para estudantes com Transtorno do Espectro Autista (TEA - Níveis de Suporte 1 e 2), TDAH, dificuldades de leitura, dislexia e outras necessidades educacionais.

---

## 🌟 Principais Recursos e Diferenciais

1. **Botão e Leitor em Áudio para Dificuldades de Leitura**:
   - Botão **"Ouvir Página"** presente no cabeçalho em todas as telas.
   - **Assistente Flutuante de Áudio**: Leitura de todo o conteúdo da página ou apenas do texto selecionado com o cursor do mouse.
   - **Ajuste de Velocidade da Voz**: 0.75x (Calmo e pausado para fácil compreensão), 1.0x (Normal) e 1.25x (Dinâmico).
   - **Atalho de Teclado Acessível**: Pressione <kbd>Alt + A</kbd> a qualquer momento para iniciar ou pausar a leitura em áudio.

2. **Acesso Facial Inclusivo & Seguro (Sem Senhas)**:
   - O aluno não precisa digitar logins, e-mails ou senhas complexas para acessar suas atividades.
   - Reconhecimento facial com verificação de vivacidade (*liveness detection*) para evitar fraudes com fotos.
   - **Chave de Acesso Alternativa**: PIN de 4 dígitos ou símbolos ilustrados (ex: Estrela, Lápis, Livro) caso a câmera não esteja disponível.
   - Proteção de dados biométricos conforme a **LGPD** e o **ECA**: fotos não são salvas no banco; apenas vetores matemáticos unidirecionais criptografados.

3. **Ferramenta "Escolher Como Quero Ler"**:
   - Alternância funcional instantânea entre:
     - **Letra Cursiva Escolar** (Caveat)
     - **Letra Bastão de Forma / Caixa Alta** (Comic Neue / Lexend)
     - **Fonte Sem Serifa de Alta Legibilidade** (Plus Jakarta Sans)
   - Ajustes individuais de tamanho da fonte (A- / A / A+), espaçamento entre linhas e letras, destaque da instrução focal e modo de conforto sensorial.

4. **Trilhas e Atividades Educacionais em Pequenos Passos**:
   - Conteúdo focado na disciplina de Administração Escolar e Rotinas, dividido em pequenos passos sucessivos.
   - Apoio com cartões de vocabulário e exemplos práticos da vida real.
   - Feedback exclusivamente positivo, sem telas punitivas vermelhas ou sons estridentes.
   - Opção de pausa tranquila a qualquer instante sem perder o progresso.

5. **Área do Professor & Agente Pedagógico com IA**:
   - Acesso institucional por e-mail e senha.
   - Cadastro e perfil de acessibilidade de cada aluno com termo de consentimento dos responsáveis.
   - Gerador e adaptador de atividades pedagógicas com apoio de IA (Google Gemini).
   - Relatórios pedagógicos e registro auditável de conformidade (Audit Logs).

---

## 🚀 Como Publicar: GitHub, Supabase & Vercel

O projeto está 100% pronto para publicação com banco de dados PostgreSQL no **Supabase** e hospedagem na **Vercel**.

Consulte o guia completo com passo a passo ilustrado no arquivo:
👉 **[TUTORIAL_GITHUB_SUPABASE_VERCEL.md](./TUTORIAL_GITHUB_SUPABASE_VERCEL.md)**

### Resumo Rápido:

1. **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: lancamento aura educacional"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/aura-educacional.git
   git push -u origin main
   ```

2. **Supabase**:
   - Crie um projeto gratuito em [supabase.com](https://supabase.com).
   - Abra o **SQL Editor** e execute o script `supabase/schema.sql`.
   - Copie a **Project URL** e a **anon public key**.

3. **Vercel**:
   - Conecte seu repositório no [vercel.com](https://vercel.com).
   - Configure o framework como **Vite** e as variáveis de ambiente:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `GEMINI_API_KEY` (opcional, para adaptação ao vivo por IA)
   - Clique em **Deploy**!

---

## 📂 Arquivos Chave do Projeto

- `supabase/schema.sql`: Script SQL com todas as tabelas (`teachers`, `students`, `activities`, `audit_logs`), políticas RLS e dados iniciais.
- `src/services/supabaseClient.ts`: Conexão com o Supabase com fallback automático para `localStorage`.
- `src/services/speechService.ts`: Serviço de narração em áudio em português com velocidades ajustáveis.
- `src/components/common/FloatingAudioNarrator.tsx`: Widget flutuante de acessibilidade em áudio.
- `src/components/common/GlobalAudioButton.tsx`: Botão de leitura em áudio para o cabeçalho.
- `vercel.json`: Regras de roteamento para deploys na Vercel sem erro 404 em rotas SPA.
- `.env.example`: Modelo de variáveis de ambiente.
