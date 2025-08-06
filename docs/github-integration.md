# Integração com GitHub

Este documento descreve como integrar este projeto com o repositório GitHub da TV Doutor.

## 📋 Pré-requisitos

1. **Acesso ao repositório**: Você precisa ter acesso ao repositório `https://github.com/TVDoutor/doutor-contrato-facil.git`
2. **Git configurado**: Certifique-se de que o Git está configurado com suas credenciais
3. **Node.js**: Versão 18+ instalada

## 🔧 Configuração Inicial

### 1. Clone do Repositório

```bash
# Clone o repositório original
git clone https://github.com/TVDoutor/doutor-contrato-facil.git tv-doutor-original

# Entre na pasta
cd tv-doutor-original
```

### 2. Backup do Sistema Atual

```bash
# Crie uma branch de backup
git checkout -b backup-sistema-atual

# Commit das mudanças atuais
git add .
git commit -m "Backup do sistema atual antes da integração"

# Push para o repositório
git push origin backup-sistema-atual
```

### 3. Integração do Novo Sistema

```bash
# Volte para a branch principal
git checkout main

# Copie os arquivos do novo sistema
# (Execute os comandos de cópia necessários)

# Adicione as mudanças
git add .

# Commit das novas funcionalidades
git commit -m "Integração: Sistema de autenticação e dashboard

- Adicionado sistema de autenticação completo
- Implementado dashboard administrativo
- Proteção de rotas com AuthContext
- Interface responsiva e moderna
- Credenciais de teste incluídas"

# Push para o repositório
git push origin main
```

## 📁 Estrutura de Arquivos a Serem Integrados

### Novos Arquivos

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticação
├── components/
│   └── ProtectedRoute.tsx       # Componente de proteção de rotas
├── pages/
│   ├── Login.tsx                # Página de login/registro
│   └── Dashboard.tsx            # Dashboard administrativo
```

### Arquivos Modificados

```
src/
├── App.tsx                      # Adicionadas rotas protegidas
├── pages/
│   └── Index.tsx                # Adicionado botão de acesso ao dashboard
└── README.md                    # Documentação atualizada
```

## 🔐 Configuração de Autenticação

### Credenciais de Teste

O sistema inclui credenciais de teste para desenvolvimento:

- **Admin**: admin@tvdoutor.com / admin123
- **Usuário**: user@tvdoutor.com / user123

### Produção

Para produção, você deve:

1. **Implementar backend real**: Substituir a autenticação simulada
2. **Configurar banco de dados**: Para armazenar usuários e contratos
3. **Adicionar validação**: Validação de email e senha mais robusta
4. **Implementar JWT**: Para autenticação segura

## 🚀 Deploy

### 1. Build de Produção

```bash
npm run build
```

### 2. Deploy no GitHub Pages

```bash
# Instale o gh-pages
npm install --save-dev gh-pages

# Adicione ao package.json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}

# Deploy
npm run deploy
```

### 3. Configuração do GitHub Actions

Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🔧 Configurações Adicionais

### Variáveis de Ambiente

Crie um arquivo `.env` para configurações:

```env
# Autenticação
VITE_AUTH_ENDPOINT=https://api.tvdoutor.com/auth
VITE_API_BASE_URL=https://api.tvdoutor.com

# n8n Integration
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/contract

# Analytics
VITE_GA_TRACKING_ID=GA-XXXXXXXXX
```

### Configuração do Vite

Atualize `vite.config.ts` se necessário:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

## 📊 Monitoramento

### 1. Analytics

Adicione Google Analytics ou similar para monitorar uso.

### 2. Logs

Implemente sistema de logs para:
- Tentativas de login
- Geração de contratos
- Erros do sistema

### 3. Métricas

Monitore:
- Usuários ativos
- Contratos gerados
- Tempo de processamento
- Taxa de erro

## 🔒 Segurança

### 1. HTTPS

Certifique-se de que o site usa HTTPS em produção.

### 2. Headers de Segurança

Configure headers de segurança no servidor:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

### 3. Validação de Input

Implemente validação robusta em todos os formulários.

## 📞 Suporte

Para problemas com a integração:

1. Verifique os logs do GitHub Actions
2. Teste localmente antes do deploy
3. Use as credenciais de teste para validação
4. Consulte a documentação do projeto

## 🎯 Próximos Passos

1. **Implementar backend real**
2. **Configurar banco de dados**
3. **Adicionar testes automatizados**
4. **Implementar CI/CD completo**
5. **Configurar monitoramento**
6. **Otimizar performance**

---

**Documentação criada para facilitar a integração com o repositório GitHub da TV Doutor** 