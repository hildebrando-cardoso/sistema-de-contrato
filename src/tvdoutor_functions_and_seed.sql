-- tvdoutor_functions_and_seed.sql
-- Funções RPC + Seed de equipamentos

-- 1) Seed mínimo de tipos de equipamento (idempotente)
INSERT INTO public.equipment_types (name, model, screen_inches, default_monthly_cost, default_implant_cost)
VALUES
  ('TV 43"', NULL, 43, 0, 0),
  ('TV 55"', NULL, 55, 0, 0),
  ('Player', NULL, NULL, 0, 0)
ON CONFLICT (name) DO UPDATE SET updated_at = now();

-- 2) RPC: search_contracts
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
  plan_contracted text,
  monthly_plan_value numeric,
  total_contract_value numeric
)
LANGUAGE sql
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

-- 3) RPC: search_users
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
    COALESCE(ct.qtd,0) AS contratos
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

-- 4) RPC: report_monthly_revenue
CREATE OR REPLACE FUNCTION public.report_monthly_revenue(
  _year int
)
RETURNS TABLE (
  month date,
  revenue numeric
)
LANGUAGE sql
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

-- 5) RPC: report_contract_status
CREATE OR REPLACE FUNCTION public.report_contract_status(
  _year int
)
RETURNS TABLE (
  status_enum contract_status,
  total bigint
)
LANGUAGE sql
AS $func$
  SELECT
    c.status_enum,
    COUNT(*) AS total
  FROM public.contracts c
  WHERE EXTRACT(YEAR FROM c.signature_date) = _year
  GROUP BY c.status_enum
  ORDER BY c.status_enum;
$func$;

-- 6) RPC: report_contracts_by_state
CREATE OR REPLACE FUNCTION public.report_contracts_by_state(
  _year int
)
RETURNS TABLE (
  estado text,
  contratos bigint,
  receita numeric
)
LANGUAGE sql
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
