# Configuração do Supabase para Produção

## 1. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 2. Configuração do Banco de Dados

Execute o script `database-schema.sql` no seu projeto Supabase:

1. Acesse o painel do Supabase
2. Vá para "SQL Editor"
3. Cole e execute o conteúdo do arquivo `database-schema.sql`

## 3. Configuração de Autenticação

No painel do Supabase, vá para Authentication > Settings:

1. **Email Auth**: Habilitado
2. **Confirm email**: Habilitado (recomendado)
3. **Site URL**: Configure com a URL da sua aplicação
4. **Redirect URLs**: Adicione as URLs necessárias

## 4. Políticas RLS (Row Level Security)

As políticas de segurança já estão incluídas no script SQL. Elas garantem que:

- Usuários só podem ver seus próprios dados
- Administradores têm acesso completo
- Logs de auditoria são mantidos

## 5. Primeiro Usuário Administrador

Para criar o primeiro usuário administrador:

1. Registre-se normalmente pela interface
2. No painel do Supabase, vá para "Table Editor" > "profiles"
3. Encontre seu usuário e altere:
   - `role`: `admin`
   - `is_super_admin`: `true`

## 6. Funcionalidades Implementadas

✅ **Autenticação Real**
- Login com email/senha
- Registro de novos usuários
- Logout seguro
- Gerenciamento de sessões

✅ **Gerenciamento de Usuários**
- Criação de usuários por administradores
- Edição de perfis e permissões
- Exclusão de usuários
- Reset de senhas

✅ **Contratos**
- Salvamento real no banco de dados
- Histórico completo de alterações
- Logs de auditoria
- Busca e filtros

✅ **Relatórios**
- Dados reais do banco
- Métricas em tempo real
- Filtros por período

## 7. Estrutura do Banco

### Tabelas Principais:
- `profiles`: Perfis de usuários
- `contracts`: Contratos principais
- `contractors`: Empresas contratantes
- `contract_equipment`: Equipamentos por contrato
- `equipment_types`: Tipos de equipamentos
- `activity_logs`: Logs de auditoria
- `contract_history`: Histórico de alterações

### Funções RPC:
- `search_contracts`: Busca de contratos
- `search_users`: Busca de usuários
- `report_monthly_revenue`: Relatório de receita mensal
- `report_contract_status`: Status dos contratos
- `report_contracts_by_state`: Contratos por estado

## 8. Segurança

- **RLS habilitado** em todas as tabelas sensíveis
- **Políticas de acesso** baseadas em roles
- **Logs de auditoria** para todas as ações
- **Validação de permissões** no frontend e backend

## 9. Deploy

Para fazer o deploy:

1. Configure as variáveis de ambiente no seu provedor (Netlify, Vercel, etc.)
2. Execute o build: `npm run build`
3. Faça o deploy da pasta `dist`

## 10. Backup e Manutenção

- Configure backups automáticos no Supabase
- Monitore os logs de erro
- Verifique as métricas de uso regularmente

