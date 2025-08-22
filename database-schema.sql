-- ============================================
-- ESQUEMA COMPLETO DO BANCO DE DADOS
-- Sistema de Contratos TV Doutor
-- ============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS E TIPOS
-- ============================================

-- Status dos contratos
CREATE TYPE contract_status AS ENUM (
  'pending',    -- Pendente
  'approved',   -- Aprovado
  'rejected',   -- Rejeitado
  'draft'       -- Rascunho
);

-- Roles de usuário
CREATE TYPE user_role AS ENUM (
  'admin',      -- Administrador
  'user',       -- Usuário comum
  'super_admin' -- Super administrador
);

-- Planos disponíveis
CREATE TYPE contract_plan AS ENUM (
  'cuidar-educar-especialidades',
  'cuidar-educar-exclusivo',
  'cuidar-educar-padrao'
);

-- Formas de pagamento
CREATE TYPE payment_method AS ENUM (
  'boleto',
  'cartao',
  'pix',
  'transferencia'
);

-- ============================================
-- TABELAS PRINCIPAIS
-- ============================================

-- Tabela de empresas/organizações
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de perfis de usuário (integrada com Supabase Auth)
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role user_role DEFAULT 'user',
  is_super_admin BOOLEAN DEFAULT FALSE,
  phone VARCHAR(20),
  company_id UUID REFERENCES companies(id),
  last_activity TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de tipos de equipamentos
CREATE TABLE equipment_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE, -- 'TV 43"', 'TV 55"', 'Player'
  model VARCHAR(100),
  screen_inches INTEGER,
  default_monthly_cost DECIMAL(10,2) DEFAULT 0,
  default_implant_cost DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela principal de contratos
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255), -- Título/identificação do contrato
  
  -- Dados gerais do contrato
  city VARCHAR(100),
  state VARCHAR(2),
  signature_date DATE,
  status_enum contract_status DEFAULT 'pending',
  plan_contracted contract_plan,
  
  -- Valores financeiros
  implementation_value DECIMAL(12,2), -- Valor de implantação
  monthly_plan_value DECIMAL(10,2),   -- Valor mensal do plano
  total_contract_value DECIMAL(12,2), -- Valor total do contrato
  
  -- Dados de pagamento
  payment_method payment_method,
  due_date DATE,
  contract_term INTEGER DEFAULT 12, -- Prazo em meses
  
  -- Metadados
  user_id UUID REFERENCES profiles(user_id),
  company_id UUID REFERENCES companies(id),
  generated_contract_text TEXT, -- Texto completo do contrato gerado
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de contratantes (empresas que contratam o serviço)
CREATE TABLE contractors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  
  -- Dados da empresa contratante
  contractor_name VARCHAR(255) NOT NULL,
  contractor_cnpj VARCHAR(18) NOT NULL,
  contractor_address TEXT NOT NULL,
  
  -- Dados do representante legal
  legal_representative VARCHAR(255) NOT NULL,
  representative_cpf VARCHAR(14) NOT NULL,
  
  -- Ordem no contrato (para múltiplos contratantes)
  order_index INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de equipamentos por contrato
CREATE TABLE contract_equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  equipment_type_id UUID REFERENCES equipment_types(id),
  
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_value DECIMAL(10,2), -- Valor unitário do equipamento
  total_value DECIMAL(10,2), -- Valor total (quantity * unit_value)
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELAS DE AUDITORIA E LOG
-- ============================================

-- Log de atividades do sistema
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id),
  action VARCHAR(100) NOT NULL, -- 'create_contract', 'update_user', etc.
  resource_type VARCHAR(50),    -- 'contract', 'user', etc.
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Histórico de mudanças nos contratos
CREATE TABLE contract_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(user_id),
  action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'approved', 'rejected'
  old_values JSONB,
  new_values JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

-- Índices para contratos
CREATE INDEX idx_contracts_user_id ON contracts(user_id);
CREATE INDEX idx_contracts_status ON contracts(status_enum);
CREATE INDEX idx_contracts_signature_date ON contracts(signature_date);
CREATE INDEX idx_contracts_city_state ON contracts(city, state);
CREATE INDEX idx_contracts_plan ON contracts(plan_contracted);

-- Índices para contratantes
CREATE INDEX idx_contractors_contract_id ON contractors(contract_id);
CREATE INDEX idx_contractors_cnpj ON contractors(contractor_cnpj);

-- Índices para equipamentos
CREATE INDEX idx_contract_equipment_contract_id ON contract_equipment(contract_id);
CREATE INDEX idx_contract_equipment_type_id ON contract_equipment(equipment_type_id);

-- Índices para perfis
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_company_id ON profiles(company_id);

-- Índices para logs
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_contract_history_contract_id ON contract_history(contract_id);

-- ============================================
-- TRIGGERS PARA TIMESTAMPS AUTOMÁTICOS
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers em todas as tabelas relevantes
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contract_equipment_updated_at BEFORE UPDATE ON contract_equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_types_updated_at BEFORE UPDATE ON equipment_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ============================================

-- Habilitar RLS nas tabelas principais
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_equipment ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para contracts
CREATE POLICY "Users can view own contracts" ON contracts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create contracts" ON contracts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contracts" ON contracts
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para admins (acesso completo)
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND (role = 'admin' OR is_super_admin = TRUE)
    )
  );

CREATE POLICY "Admins have full access to contracts" ON contracts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND (role = 'admin' OR is_super_admin = TRUE)
    )
  );

-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================

-- Inserir tipos de equipamentos padrão
INSERT INTO equipment_types (name, model, screen_inches, default_monthly_cost, default_implant_cost)
VALUES
  ('TV 43"', NULL, 43, 0, 0),
  ('TV 55"', NULL, 55, 0, 0),
  ('Player', NULL, NULL, 0, 0)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- FUNÇÕES RPC PARA RELATÓRIOS
-- ============================================

-- Função para buscar contratos
CREATE OR REPLACE FUNCTION public.search_contracts(
  _q       text DEFAULT NULL,
  _status  contract_status DEFAULT NULL,
  _limit   integer DEFAULT 20,
  _offset  integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  city text,
  state text,
  signature_date date,
  status_enum contract_status,
  plan_contracted contract_plan,
  monthly_plan_value numeric,
  total_contract_value numeric
)
LANGUAGE sql
SECURITY DEFINER
AS $func$
  SELECT
    c.id,
    c.title,
    c.city, c.state,
    c.signature_date,
    c.status_enum,
    c.plan_contracted,
    c.monthly_plan_value,
    c.total_contract_value
  FROM public.contracts c
  WHERE
    (_status IS NULL OR c.status_enum = _status)
    AND (
      _q IS NULL OR _q = '' OR
      c.title ILIKE '%'||_q||'%' OR
      c.city  ILIKE '%'||_q||'%' OR
      c.state ILIKE '%'||_q||'%'
    )
  ORDER BY c.signature_date DESC NULLS LAST
  LIMIT COALESCE(_limit, 50)
  OFFSET COALESCE(_offset, 0);
$func$;

-- Função para buscar usuários
CREATE OR REPLACE FUNCTION public.search_users(
  _q       text DEFAULT NULL,
  _role    text DEFAULT NULL,
  _status  boolean DEFAULT NULL,
  _limit   integer DEFAULT 20,
  _offset  integer DEFAULT 0
)
RETURNS TABLE (
  user_id uuid,
  name text,
  email text,
  role text,
  is_super_admin boolean,
  last_activity timestamptz,
  created_at timestamptz,
  company_id uuid,
  contratos integer
)
LANGUAGE sql
SECURITY DEFINER
AS $func$
  SELECT
    p.user_id,
    p.name,
    p.email,
    p.role::text,
    p.is_super_admin,
    p.last_activity,
    p.created_at,
    p.company_id,
    COALESCE(ct.qtd,0)::integer AS contratos
  FROM public.profiles p
  LEFT JOIN (
    SELECT user_id, COUNT(*) AS qtd
    FROM public.contracts
    GROUP BY user_id
  ) ct ON ct.user_id = p.user_id
  WHERE
    (_role IS NULL OR p.role::text = _role)
    AND (_status IS NULL OR (p.last_activity >= now() - INTERVAL '30 days') = _status)
    AND (
      _q IS NULL OR _q = '' OR
      p.name  ILIKE '%'||_q||'%' OR
      p.email ILIKE '%'||_q||'%'
    )
  ORDER BY p.created_at DESC
  LIMIT COALESCE(_limit, 50)
  OFFSET COALESCE(_offset, 0);
$func$;

-- Função para relatório de receita mensal
CREATE OR REPLACE FUNCTION public.report_monthly_revenue(
  _year int
)
RETURNS TABLE (
  month date,
  revenue numeric
)
LANGUAGE sql
SECURITY DEFINER
AS $func$
  SELECT
    date_trunc('month', c.signature_date)::date AS month,
    SUM(c.monthly_plan_value) AS revenue
  FROM public.contracts c
  WHERE EXTRACT(YEAR FROM c.signature_date) = _year
    AND c.status_enum IN ('approved','pending')
  GROUP BY 1
  ORDER BY 1;
$func$;

-- Função para relatório de status dos contratos
CREATE OR REPLACE FUNCTION public.report_contract_status(
  _year int
)
RETURNS TABLE (
  status_enum contract_status,
  total bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $func$
  SELECT
    c.status_enum,
    COUNT(*) AS total
  FROM public.contracts c
  WHERE EXTRACT(YEAR FROM c.signature_date) = _year
  GROUP BY c.status_enum
  ORDER BY c.status_enum;
$func$;

-- Função para relatório por estado
CREATE OR REPLACE FUNCTION public.report_contracts_by_state(
  _year int
)
RETURNS TABLE (
  estado text,
  contratos bigint,
  receita numeric
)
LANGUAGE sql
SECURITY DEFINER
AS $func$
  SELECT
    COALESCE(c.state,'NA') AS estado,
    COUNT(*)               AS contratos,
    SUM(c.monthly_plan_value) AS receita
  FROM public.contracts c
  WHERE EXTRACT(YEAR FROM c.signature_date) = _year
  GROUP BY 1
  ORDER BY receita DESC NULLS LAST;
$func$;

-- ============================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- ============================================

COMMENT ON TABLE contracts IS 'Tabela principal dos contratos gerados no sistema';
COMMENT ON TABLE contractors IS 'Empresas/pessoas que contratam os serviços (pode haver múltiplos por contrato)';
COMMENT ON TABLE contract_equipment IS 'Equipamentos incluídos em cada contrato com quantidades e valores';
COMMENT ON TABLE profiles IS 'Perfis de usuário integrados com Supabase Auth';
COMMENT ON TABLE equipment_types IS 'Tipos de equipamentos disponíveis (TVs, Players, etc.)';
COMMENT ON TABLE activity_logs IS 'Log de todas as atividades realizadas no sistema';
COMMENT ON TABLE contract_history IS 'Histórico de mudanças nos contratos para auditoria';

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View para contratos com informações completas
CREATE VIEW contracts_full AS
SELECT 
  c.*,
  p.name as user_name,
  p.email as user_email,
  comp.name as company_name,
  COUNT(ct.id) as contractors_count,
  COUNT(ce.id) as equipment_count
FROM contracts c
LEFT JOIN profiles p ON c.user_id = p.user_id
LEFT JOIN companies comp ON c.company_id = comp.id
LEFT JOIN contractors ct ON c.id = ct.contract_id
LEFT JOIN contract_equipment ce ON c.id = ce.contract_id
GROUP BY c.id, p.name, p.email, comp.name;

-- View para relatório de equipamentos mais usados
CREATE VIEW equipment_usage_report AS
SELECT 
  et.name as equipment_name,
  et.screen_inches,
  SUM(ce.quantity) as total_quantity,
  COUNT(DISTINCT ce.contract_id) as contracts_count,
  AVG(ce.unit_value) as avg_unit_value
FROM contract_equipment ce
JOIN equipment_types et ON ce.equipment_type_id = et.id
JOIN contracts c ON ce.contract_id = c.id
WHERE c.status_enum IN ('approved', 'pending')
GROUP BY et.id, et.name, et.screen_inches
ORDER BY total_quantity DESC;
