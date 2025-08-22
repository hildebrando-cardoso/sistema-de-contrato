-- Verificar se as políticas RLS estão funcionando

-- 1. Verificar se RLS está habilitado na tabela profiles
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- 2. Listar políticas da tabela profiles
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- 3. Temporariamente, você pode desabilitar RLS para teste (NÃO recomendado para produção)
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 4. Para reabilitar depois do teste:
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
