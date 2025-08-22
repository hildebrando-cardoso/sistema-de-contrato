// Script para testar conexão com Supabase
// Execute: node test-connection.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Testando conexão com Supabase...')
console.log('URL:', supabaseUrl ? '✅ Configurada' : '❌ Não encontrada')
console.log('Key:', supabaseKey ? '✅ Configurada' : '❌ Não encontrada')

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Erro: Variáveis de ambiente não configuradas!')
  console.log('Crie o arquivo .env.local com:')
  console.log('VITE_SUPABASE_URL=https://seu-projeto.supabase.co')
  console.log('VITE_SUPABASE_ANON_KEY=sua_chave_aqui')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('\n🔄 Testando conexão...')
    
    // Teste 1: Verificar se consegue conectar
    const { data, error } = await supabase
      .from('equipment_types')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Erro na conexão:', error.message)
      return
    }
    
    console.log('✅ Conexão estabelecida com sucesso!')
    
    // Teste 2: Verificar tabelas
    const { data: tables, error: tableError } = await supabase
      .rpc('check_tables')
      .catch(() => ({ data: null, error: null }))
    
    // Teste 3: Verificar dados iniciais
    console.log('\n📊 Verificando dados iniciais...')
    const { data: equipmentTypes } = await supabase
      .from('equipment_types')
      .select('*')
    
    if (equipmentTypes && equipmentTypes.length > 0) {
      console.log('✅ Tipos de equipamentos encontrados:', equipmentTypes.length)
      equipmentTypes.forEach(eq => {
        console.log(`  - ${eq.name}`)
      })
    } else {
      console.log('⚠️  Nenhum tipo de equipamento encontrado')
      console.log('   Execute o database-schema.sql no Supabase')
    }
    
    // Teste 4: Verificar funções RPC
    console.log('\n🔧 Testando funções RPC...')
    const { data: monthlyData, error: rpcError } = await supabase
      .rpc('report_monthly_revenue', { _year: 2024 })
    
    if (rpcError) {
      console.log('⚠️  Funções RPC não encontradas:', rpcError.message)
      console.log('   Execute o database-schema.sql no Supabase')
    } else {
      console.log('✅ Funções RPC funcionando!')
    }
    
    console.log('\n🎉 Teste de conexão concluído!')
    
  } catch (error) {
    console.log('❌ Erro inesperado:', error.message)
  }
}

testConnection()
