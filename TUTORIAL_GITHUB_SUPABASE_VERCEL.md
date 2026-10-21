# 📘 Tutorial Completo: GitHub, Banco de Dados Supabase e Deploy na Vercel

Este guia prático explica, passo a passo, tudo o que você precisa fazer para:
1. Colocar o projeto **Aura** no seu **GitHub**;
2. Criar e configurar o banco de dados PostgreSQL no **Supabase**;
3. Publicar o site na **Vercel** com endereço público na internet.

---

## 🧰 O que você vai precisar (Tudo Gratuito)

- Uma conta no [GitHub](https://github.com);
- Uma conta no [Supabase](https://supabase.com);
- Uma conta na [Vercel](https://vercel.com) (você pode entrar usando sua conta do GitHub);
- [Git](https://git-scm.com) instalado no seu computador.

---

## 🚀 PARTE 1: Colocar o Projeto no GitHub

### 1.1 Criar o repositório no GitHub
1. Acesse [github.com/new](https://github.com/new).
2. Em **Repository name**, digite: `aura-educacional` (ou outro nome de sua preferência).
3. Marque como **Public** (Público).
4. **NÃO marque** as opções de "Add a README file", ".gitignore" ou "license", pois o projeto já possui esses arquivos configurados.
5. Clique no botão verde **"Create repository"**.
6. Copie a URL do seu repositório (exemplo: `https://github.com/seu-usuario/aura-educacional.git`).

### 1.2 Enviar os arquivos pelo Terminal
No seu computador, abra o terminal na pasta raiz onde estão os arquivos do projeto e execute os comandos abaixo em ordem:

```bash
# 1. Iniciar o rastreamento do Git (caso ainda não esteja iniciado)
git init

# 2. Adicionar todos os arquivos do projeto ao controle de versão
git add .

# 3. Criar o commit inicial com uma mensagem descritiva
git commit -m "feat: primeira versao da plataforma inclusiva Aura"

# 4. Definir a branch principal como main
git branch -M main

# 5. Conectar com o seu repositório no GitHub (substitua com a URL copiada no passo 1.1)
git remote add origin https://github.com/SEU-USUARIO/aura-educacional.git

# 6. Enviar os arquivos para o GitHub
git push -u origin main
```

> **Pronto!** Seus arquivos já estarão guardados em segurança no seu GitHub.

---

## 🗄️ PARTE 2: Criar e Configurar o Banco de Dados no Supabase

O Aura já vem com o arquivo `supabase/schema.sql` pronto, contendo todas as tabelas, índices e dados iniciais.

### 2.1 Criar um novo projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e entre na sua conta.
2. No painel inicial, clique em **"New project"**.
3. Preencha os campos:
   - **Name**: `aura-database` (ou qualquer nome desejado).
   - **Database Password**: Escolha uma senha forte e guarde-a.
   - **Region**: Escolha a região mais próxima (ex: `South America (São Paulo) - sa-east-1` ou `East US`).
   - **Pricing Plan**: Selecione **Free tier** (gratuito).
4. Clique em **"Create new project"** e aguarde cerca de 1 a 2 minutos enquanto o banco de dados é provisionado.

### 2.2 Executar o Script de Criação das Tabelas (`schema.sql`)
1. No menu lateral esquerdo do Supabase, clique no ícone **SQL Editor** (o símbolo `>_`).
2. Clique no botão **"New query"** (ou `+`).
3. Abra o arquivo `supabase/schema.sql` do seu projeto Aura no seu computador.
4. Copie **todo o conteúdo** do arquivo `supabase/schema.sql` e cole no editor SQL do Supabase.
5. Clique no botão verde **"Run"** (no canto inferior direito ou superior direito).
6. Você verá a mensagem **"Success. No rows returned"**.
   - As tabelas `teachers`, `students`, `activities` e `audit_logs` foram criadas com todas as regras de segurança (RLS) e dados de demonstração (como os alunos Lucas e Beatriz e as atividades de administração).

### 2.3 Obter as Chaves de Conexão do Supabase
1. No menu lateral esquerdo do Supabase, clique em **Project Settings** (ícone da engrenagem ⚙️ na parte inferior).
2. Clique em **API** (ou **Data API**).
3. Localize e copie dois valores:
   - **Project URL**: Algo como `https://abcdefghijklm.supabase.co`
   - **anon / public key**: Uma chave longa que começa com `eyJhbGciOi...`
4. Guarde esses dois valores, pois vamos colocá-los na Vercel no próximo passo!

---

## 🌐 PARTE 3: Publicar o Site na Vercel

A Vercel compila sua aplicação React/Vite e disponibiliza um link público HTTPS com certificado de segurança automático.

### 3.1 Importar o Projeto do GitHub para a Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login (recomendamos login com sua conta do GitHub).
2. No Dashboard da Vercel, clique no botão **"Add New..."** e selecione **"Project"**.
3. Na lista de repositórios do GitHub, encontre o repositório `aura-educacional` e clique em **"Import"**.

### 3.2 Configurar o Projeto na Vercel
Na tela de configuração:
- **Project Name**: Pode manter `aura-educacional` (este nome fará parte do seu link: `aura-educacional.vercel.app`).
- **Framework Preset**: Certifique-se de que está selecionado **Vite**.
- **Root Directory**: Deixe `./`.
- **Build and Output Settings**:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`

### 3.3 Adicionar as Variáveis de Ambiente na Vercel
Antes de clicar em Deploy, expanda a seção **"Environment Variables"** e adicione as seguintes variáveis:

1. **Primeira Variável:**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: Cole a **Project URL** que você copiou no Supabase (ex: `https://abcdefghijklm.supabase.co`).
   - Clique em **Add**.

2. **Segunda Variável:**
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Cole a chave **anon public** que você copiou no Supabase.
   - Clique em **Add**.

3. **Terceira Variável (Opcional, para adaptações com IA):**
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Sua chave de API do Google AI Studio (se tiver uma). Caso não adicione, a plataforma usará automaticamente o gerador pedagógico padrão inteligente embutido.
   - Clique em **Add**.

### 3.4 Fazer o Deploy
1. Clique no botão azul **"Deploy"**.
2. Aguarde entre 1 e 2 minutos enquanto a Vercel faz a instalação das dependências e o build da aplicação.
3. Quando finalizar, aparecerão confetes na tela com a mensagem **"Congratulations!"** e o link do seu site no ar (ex: `https://aura-educacional.vercel.app`).
4. Clique na imagem da prévia para abrir o site funcionando ao vivo!

---

## 🔊 PARTE 4: Como Testar os Recursos no Ar

Assim que o site estiver no ar, teste as principais funcionalidades inclusivas:

1. **Botão de Áudio para quem tem dificuldade de ler**:
   - No topo da tela (cabeçalho), clique no botão **"Ouvir Página"**. O sistema narrará os textos em tom calmo em português.
   - No canto inferior direito da tela, use o **Assistente Flutuante de Leitura**:
     - Clique em **"Ouvir Texto"** para começar a leitura;
     - Selecione qualquer frase da tela com o cursor do mouse e clique em **"Ouvir texto selecionado"**;
     - Clique no ícone de opções para ajustar a velocidade entre **0.75x (Calmo)**, **1.0x (Normal)** ou **1.25x (Rápido)**;
     - Ou pressione o atalho de teclado acessível: <kbd>Alt + A</kbd>.
2. **Entrada do Aluno (Reconhecimento Facial e Chave Inclusiva)**:
   - Clique em **"Sou aluno"**.
   - Posicione o rosto na câmera com boa iluminação e clique em **"Reconhecer Meu Rosto"**;
   - Se preferir ou não tiver webcam, clique em **"Entrar com Código ou Símbolos"** e digite o PIN `1234` (para o aluno Lucas) ou selecione os símbolos ilustrados (Estrela, Lápis, Livro).
3. **Ferramenta "Como Quero Ler"**:
   - Clique no botão **"Como quero ler"** no cabeçalho.
   - Alterne entre **Letra Bastão (Caixa Alta)**, **Letra Cursiva Escolar** e **Sem Serifa**, aumente o tamanho da letra ou ative o modo de conforto sensorial.
4. **Área do Professor**:
   - Clique em **"Sou professor"**.
   - Faça login com o e-mail: `marina.albuquerque@escola.edu.br` e a senha: `admin123`.
   - Você poderá cadastrar novos alunos, configurar o acesso facial com consentimento LGPD, editar atividades de administração com apoio de IA e visualizar relatórios pedagógicos completos.

---

## 💡 Dúvidas Frequentes

### E se o Supabase não estiver configurado ou cair a internet?
O Aura foi desenvolvido com arquitetura resiliente (*graceful fallback*): se as credenciais do Supabase não forem informadas ou se houver oscilação de conexão, a plataforma armazena e lê os dados localmente no navegador (`localStorage`), garantindo que o estudante nunca fique sem acesso às suas atividades.

### Como atualizar o site depois de fazer novas alterações?
Sempre que você alterar algum arquivo no seu computador, basta rodar no terminal:
```bash
git add .
git commit -m "melhoria: atualizacao da plataforma"
git push
```
A Vercel detecta automaticamente o novo push e atualiza o site no ar em poucos segundos!
