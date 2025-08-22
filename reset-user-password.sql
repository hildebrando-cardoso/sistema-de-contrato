-- Execute este SQL no Supabase SQL Editor para resetar a senha

-- 1. Confirmar email do usuário (se necessário)
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW()
WHERE email = 'suporte@tvdoutor.com.br';

-- 2. Verificar se o perfil existe
SELECT * FROM public.profiles 
WHERE email = 'suporte@tvdoutor.com.br';

-- 3. Se não existir perfil, criar um (execute apenas se necessário)
-- INSERT INTO public.profiles (user_id, name, email, role, is_super_admin)
-- SELECT id, 'Super Admin', 'suporte@tvdoutor.com.br', 'admin'::user_role, true
-- FROM auth.users 
-- WHERE email = 'suporte@tvdoutor.com.br'
-- ON CONFLICT (user_id) DO NOTHING;
