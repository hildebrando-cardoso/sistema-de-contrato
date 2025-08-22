// Script temporário para criar usuário admin no Supabase
// Execute: node create-admin-user.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Você precisa desta chave

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  console.log('Você precisa de:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY (Service Role Key do Supabase)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    // Criar usuário no Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@tvdoutor.com',
      password: 'admin123456',
      email_confirm: true
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário no Auth:', authError.message);
      return;
    }

    console.log('✅ Usuário criado no Auth:', authUser.user.email);

    // Criar perfil na tabela profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        user_id: authUser.user.id,
        name: 'Administrador Sistema',
        email: authUser.user.email,
        role: 'admin',
        is_super_admin: true,
        last_activity: new Date().toISOString()
      }])
      .select()
      .single();

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError.message);
      return;
    }

    console.log('✅ Perfil criado com sucesso!');
    console.log('📧 Email:', authUser.user.email);
    console.log('🔑 Senha: admin123456');
    console.log('👤 Papel: Super Admin');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

createAdminUser();
