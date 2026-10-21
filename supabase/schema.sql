-- =========================================================================
-- SCHEMA DO SUPABASE — AURA PLATAFORMA EDUCACIONAL ADAPTATIVA E INCLUSIVA
-- =========================================================================
-- Execute este script no "SQL Editor" do painel do seu projeto no Supabase
-- (https://supabase.com/dashboard/project/_/sql)
-- =========================================================================

-- 1. Habilitar extensão para UUID se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Professores e Orientadores
CREATE TABLE IF NOT EXISTS public.teachers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    school_name TEXT NOT NULL,
    department TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Alunos (com preferências sensoriais, biometria protegida e LGPD)
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    preferred_name TEXT NOT NULL,
    registration_number TEXT UNIQUE NOT NULL,
    school_class TEXT NOT NULL,
    school_year TEXT NOT NULL,
    avatar_url TEXT,
    support_level TEXT NOT NULL DEFAULT '1' CHECK (support_level IN ('1', '2')),
    preferences JSONB NOT NULL DEFAULT '{
        "fontChoice": "bastao",
        "fontSize": "lg",
        "letterSpacing": "wide",
        "lineHeight": "relaxed",
        "highContrast": false,
        "highlightMainInstruction": true,
        "reduceMotion": false,
        "enableAudioNarrator": true,
        "soundFeedback": true,
        "hideSecondaryDetails": false,
        "calmPacing": true
    }'::jsonb,
    biometrics JSONB NOT NULL DEFAULT '{
        "isConfigured": false,
        "livenessVerified": false,
        "qualityScore": 0,
        "alternativePin": "1234",
        "alternativeSymbols": ["Estrela", "Livro", "Lápis"]
    }'::jsonb,
    consent JSONB NOT NULL DEFAULT '{
        "consentGranted": true,
        "grantedBy": "Responsável Legal",
        "relationship": "pai_mae",
        "consentDate": "2026-03-01T00:00:00Z",
        "purposeAccepted": true,
        "canRevokeAnytime": true
    }'::jsonb,
    completed_activity_ids TEXT[] DEFAULT '{}',
    in_progress_activity_id TEXT,
    skill_mastery JSONB NOT NULL DEFAULT '{
        "organizacaoRotina": 50,
        "trabalhoEquipe": 50,
        "autonomiaMetas": 50,
        "comunicacaoEmpatica": 50,
        "financasCotidiano": 50
    }'::jsonb,
    total_stars INTEGER DEFAULT 0,
    peaceful_focus_minutes INTEGER DEFAULT 0,
    needs_pedagogical_support BOOLEAN DEFAULT false,
    support_reason TEXT,
    restricted_clinical_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Atividades Educacionais Inclusivas
CREATE TABLE IF NOT EXISTS public.activities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    topic TEXT NOT NULL,
    discipline TEXT NOT NULL,
    description TEXT,
    target_support_level TEXT NOT NULL DEFAULT 'ambos' CHECK (target_support_level IN ('1', '2', 'ambos')),
    estimated_minutes INTEGER DEFAULT 6,
    cover_image_url TEXT,
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    adaptive_ai_assistance_enabled BOOLEAN DEFAULT true,
    created_by_teacher_id TEXT REFERENCES public.teachers(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de Registros de Auditoria (Audit Logs para conformidade LGPD)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY DEFAULT ('log-' || floor(extract(epoch from now()) * 1000)::text),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    action TEXT NOT NULL,
    actor TEXT NOT NULL,
    target_student_id TEXT,
    category TEXT NOT NULL CHECK (category IN ('biometria', 'acesso', 'preferencias', 'consentimento')),
    details TEXT
);

-- =========================================================================
-- POLÍTICAS DE SEGURANÇA (Row Level Security - RLS)
-- =========================================================================
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Permitir leitura e escrita autenticada/anônima com chave pública da aplicação
CREATE POLICY "Permitir leitura pública de professores" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de alunos" ON public.students FOR SELECT USING (true);
CREATE POLICY "Permitir inserção e atualização de alunos" ON public.students FOR ALL USING (true);

CREATE POLICY "Permitir leitura de atividades" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Permitir gestão de atividades por professores" ON public.activities FOR ALL USING (true);

CREATE POLICY "Permitir registro de logs de auditoria" ON public.audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir visualização de logs por professores" ON public.audit_logs FOR SELECT USING (true);

-- =========================================================================
-- SEED DE DADOS INICIAIS
-- =========================================================================

-- Inserir Professor Inicial
INSERT INTO public.teachers (id, name, email, school_name, department)
VALUES (
    'teacher-prof-marina',
    'Prof.ª Marina Albuquerque',
    'marina.albuquerque@escola.edu.br',
    'Escola Estadual de Gestão & Inovação',
    'Coordenação Pedagógica & Práticas Inclusivas'
) ON CONFLICT (id) DO NOTHING;

-- Inserir Alunos Iniciais (Lucas e Beatriz)
INSERT INTO public.students (
    id, name, preferred_name, registration_number, school_class, school_year,
    avatar_url, support_level, preferences, biometrics, consent,
    completed_activity_ids, in_progress_activity_id, skill_mastery,
    total_stars, peaceful_focus_minutes, needs_pedagogical_support, restricted_clinical_notes
) VALUES 
(
    'aura-std-001',
    'Lucas Henrique Silva',
    'Lucas',
    'ADM-2026-081',
    '1º Ano Técnico - Turma A',
    'Ensino Médio Integrado',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Lucas&backgroundColor=dbeafe',
    '1',
    '{"fontChoice": "bastao", "fontSize": "lg", "letterSpacing": "wide", "lineHeight": "relaxed", "highContrast": false, "highlightMainInstruction": true, "reduceMotion": false, "enableAudioNarrator": true, "soundFeedback": true, "hideSecondaryDetails": false, "calmPacing": true}'::jsonb,
    '{"isConfigured": true, "registeredDate": "2026-03-10T14:30:00Z", "templateVectorHash": "geo_mesh_hash_lucas_77a98c", "livenessVerified": true, "qualityScore": 96, "alternativePin": "1234", "alternativeSymbols": ["Estrela", "Lápis", "Livro"]}'::jsonb,
    '{"consentGranted": true, "grantedBy": "Cláudia Silva (Mãe / Responsável)", "relationship": "pai_mae", "consentDate": "2026-03-09T10:00:00Z", "purposeAccepted": true, "canRevokeAnytime": true}'::jsonb,
    ARRAY['act-adm-01'],
    'act-adm-02',
    '{"organizacaoRotina": 85, "trabalhoEquipe": 90, "autonomiaMetas": 75, "comunicacaoEmpatica": 80, "financasCotidiano": 70}'::jsonb,
    18, 45, false,
    'TEA Nível 1. Excelente raciocínio lógico em categorização e organização visual. Prefere instruções com letra bastão e uma tarefa por tela.'
),
(
    'aura-std-002',
    'Beatriz Vasconcelos',
    'Bia',
    'ADM-2026-092',
    '1º Ano Técnico - Turma A',
    'Ensino Médio Integrado',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Beatriz&backgroundColor=dbeafe',
    '2',
    '{"fontChoice": "cursiva", "fontSize": "xl", "letterSpacing": "wider", "lineHeight": "loose", "highContrast": false, "highlightMainInstruction": true, "reduceMotion": true, "enableAudioNarrator": true, "soundFeedback": false, "hideSecondaryDetails": true, "calmPacing": true}'::jsonb,
    '{"isConfigured": true, "registeredDate": "2026-03-12T11:15:00Z", "templateVectorHash": "geo_mesh_hash_bia_91f4b2", "livenessVerified": true, "qualityScore": 92, "alternativePin": "4321", "alternativeSymbols": ["Sol", "Mochila", "Caderno"]}'::jsonb,
    '{"consentGranted": true, "grantedBy": "Roberto Vasconcelos (Pai)", "relationship": "pai_mae", "consentDate": "2026-03-11T16:20:00Z", "purposeAccepted": true, "canRevokeAnytime": true}'::jsonb,
    ARRAY[]::TEXT[],
    'act-adm-01',
    '{"organizacaoRotina": 60, "trabalhoEquipe": 65, "autonomiaMetas": 55, "comunicacaoEmpatica": 60, "financasCotidiano": 50}'::jsonb,
    9, 30, true,
    'TEA Nível 2 com hipersensibilidade a sons abruptos e estímulos visuais rápidos. Beneficia-se muito do modo sem sons e pausas tranquilas.'
)
ON CONFLICT (id) DO NOTHING;

-- Inserir Atividade Inicial
INSERT INTO public.activities (
    id, title, topic, discipline, description, target_support_level, estimated_minutes, steps, created_by_teacher_id
) VALUES (
    'act-adm-01',
    'Organizando Minha Rotina Escolar',
    'Rotina Escolar & Organização',
    'Práticas Educacionais Inclusivas',
    'Atividade elaborada para apoiar a organização da mochila, dos horários e dos materiais escolares com tranquilidade e autonomia.',
    'ambos',
    6,
    '[
        {
            "stepNumber": 1,
            "title": "Etapa 1: Preparando a Mochila com Calma",
            "mainInstruction": "Amanhã temos aula e queremos deixar tudo pronto sem correria. O que é mais tranquilo fazer hoje à noite?",
            "supportText": "Organizar as coisas com antecedência evita a pressa e o estresse matinal.",
            "vocabularyCard": {
                "term": "Rotina Visual",
                "definition": "Uma sequência de passos com imagens ou lista simples para não esquecer nada.",
                "example": "Olhar o quadro de horários antes de colocar os cadernos na mochila."
            },
            "type": "multipla_escolha",
            "hint": "Fazer as coisas com tempo ajuda a mente a relaxar.",
            "options": [
                {
                    "id": "opt-1a",
                    "label": "Deixar tudo espalhado e arrumar correndo minutos antes de sair",
                    "isCorrect": false,
                    "feedbackText": "Arrumar na correria pode gerar ansiedade. Vamos tentar a outra alternativa?"
                },
                {
                    "id": "opt-1b",
                    "label": "Conferir o horário das aulas e separar os cadernos necessários no seu tempo",
                    "isCorrect": true,
                    "feedbackText": "Muito bem! Essa organização traz segurança e tranquilidade para o seu dia."
                }
            ]
        }
    ]'::jsonb,
    'teacher-prof-marina'
) ON CONFLICT (id) DO NOTHING;
