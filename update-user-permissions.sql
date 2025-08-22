-- Garantir que o usuário tem as permissões corretas

UPDATE public.profiles 
SET 
    role = 'admin'::user_role,
    is_super_admin = true,
    is_active = true,
    updated_at = NOW()
WHERE email = 'suporte@tvdoutor.com.br';

-- Verificar o resultado
SELECT 
    user_id,
    name,
    email,
    role,
    is_super_admin,
    is_active,
    updated_at
FROM public.profiles 
WHERE email = 'suporte@tvdoutor.com.br';
