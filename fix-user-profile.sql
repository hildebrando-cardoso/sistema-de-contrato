-- Corrigir o perfil do usuário (execute após ver o resultado do check-existing-profile.sql)

-- Atualizar o perfil existente para ter as permissões corretas
UPDATE public.profiles 
SET 
    user_id = 'ec3d9a08-7ab9-465d-af8f-b216f55a8ecc',
    role = 'admin'::user_role,
    is_super_admin = true,
    is_active = true,
    updated_at = NOW()
WHERE email = 'suporte@tvdoutor.com.br';

-- Verificar se a atualização funcionou
SELECT 
    user_id,
    name,
    email,
    role,
    is_super_admin,
    is_active
FROM public.profiles 
WHERE email = 'suporte@tvdoutor.com.br';
