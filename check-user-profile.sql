-- Execute este SQL no Supabase para verificar o perfil do usuário

-- 1. Verificar se existe perfil na tabela profiles
SELECT * FROM public.profiles 
WHERE user_id = 'ec3d9a08-7ab9-465d-af8f-b216f55a8ecc';

-- 2. Se não existir, criar o perfil
INSERT INTO public.profiles (user_id, name, email, role, is_super_admin, created_at, updated_at)
VALUES (
    'ec3d9a08-7ab9-465d-af8f-b216f55a8ecc',
    'Super Admin',
    'suporte@tvdoutor.com.br',
    'admin'::user_role,
    true,
    NOW(),
    NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
    role = 'admin'::user_role,
    is_super_admin = true,
    updated_at = NOW();
