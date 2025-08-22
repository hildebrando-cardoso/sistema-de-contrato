// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || 'placeholder_key'

console.log('[Supabase] Configuração:');
console.log('URL:', supabaseUrl);
console.log('Key definida:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('[Supabase] VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidos. Usando valores placeholder.');
} else {
  console.log('[Supabase] Configuração carregada com sucesso!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
