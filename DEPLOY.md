# 🚀 Guia de Deploy - Sistema de Contrato

## Opções de Deploy

### 1. **Vercel (Recomendado)**

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Conecte seu repositório GitHub: `hildebrando-cardoso/sistema-de-contrato`
4. Clique em "Deploy"
5. Pronto! Seu site estará disponível em `https://sistema-de-contrato.vercel.app`

### 2. **Netlify**

1. Acesse [netlify.com](https://netlify.com) e faça login
2. Clique em "New site from Git"
3. Conecte seu repositório GitHub
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Clique em "Deploy site"

### 3. **GitHub Pages**

1. No seu repositório GitHub, vá em Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `main` / `/(root)`
4. Salve

### 4. **Firebase Hosting**

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Comandos Úteis

```bash
# Build local
npm run build

# Preview build
npm run preview

# Deploy no Vercel (se CLI instalado)
vercel
```

## Variáveis de Ambiente (se necessário)

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=sua_url_api
VITE_APP_NAME=Sistema de Contrato
```
