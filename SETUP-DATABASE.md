# 🔗 Configuração da Conexão com o Banco de Dados

## 📋 Passo a Passo para Conectar o Supabase

### 1️⃣ **Configurar Variáveis de Ambiente**

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### 2️⃣ **Como Obter as Credenciais do Supabase**

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Settings** → **API**
3. Copie os valores:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 3️⃣ **Estrutura de Arquivos**

```
projeto/
├── .env.local          ← Criar este arquivo (não commitado)
├── .env.example        ← Template já existe
├── database-schema.sql ← Esquema já criado
└── src/
    └── lib/
        └── supabaseClient.ts ← Já configurado
```

### 4️⃣ **Exemplo do .env.local**

```env
# Substitua pelos valores reais do seu projeto
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5️⃣ **Verificar Conexão**

Após configurar as variáveis, reinicie o servidor:

```bash
npm run dev
```

O sistema automaticamente:
- ✅ Detectará as variáveis configuradas
- ✅ Conectará com o Supabase
- ✅ Usará dados reais em vez de dados mockados

### 6️⃣ **Comandos de Verificação**

```bash
# Parar o servidor atual
Ctrl+C

# Reiniciar com novas variáveis
npm run dev

# Verificar se está funcionando
# Acesse: http://localhost:8080/reports
# Deve mostrar dados reais do banco
```

---

## 🔧 **Configurações Avançadas**

### **Autenticação Real (Opcional)**

Se quiser usar autenticação real do Supabase em vez da simulada:

1. No Supabase Dashboard → **Authentication** → **Settings**
2. Configure os provedores de login
3. Atualize o `AuthContext.tsx` para usar `supabase.auth`

### **Políticas RLS**

O esquema já inclui políticas de segurança. Para testá-las:

1. Crie usuários reais no Supabase Auth
2. Faça login com usuários diferentes
3. Verifique se cada usuário vê apenas seus contratos

### **Backup e Migração**

```bash
# Fazer backup do banco
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql

# Restaurar backup
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
```

---

## ⚠️ **Importantes**

1. **Nunca commite** o arquivo `.env.local`
2. **Use apenas** a `anon key` no frontend
3. **A `service_role key`** só deve ser usada no backend
4. **Teste sempre** em ambiente de desenvolvimento primeiro

---

## 🚨 **Solução de Problemas**

### Erro: "Failed to fetch"
- ✅ Verifique se as variáveis estão corretas
- ✅ Confirme se o projeto Supabase está ativo
- ✅ Teste a URL no navegador

### Erro: "Invalid API key"
- ✅ Verifique se copiou a chave completa
- ✅ Confirme se é a `anon key` e não a `service_role`
- ✅ Regenere a chave se necessário

### Dados não aparecem
- ✅ Execute o `database-schema.sql` no Supabase
- ✅ Verifique se as tabelas foram criadas
- ✅ Insira alguns dados de teste manualmente
