-- Verificar o perfil existente do usuário

SELECT 
    user_id,
    name,
    email,
    role,
    is_super_admin,
    is_active,
    created_at,
    updated_at
FROM public.profiles 
WHERE email = 'suporte@tvdoutor.com.br';

-- Verificar se o user_id bate com o do auth.users
SELECT 
    au.id as auth_user_id,
    au.email as auth_email,
    au.email_confirmed_at,
    p.user_id as profile_user_id,
    p.email as profile_email,
    p.role,
    p.is_super_admin
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'suporte@tvdoutor.com.br';
