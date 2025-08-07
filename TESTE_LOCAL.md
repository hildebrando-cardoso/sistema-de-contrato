# 🧪 Guia de Teste Local - Botão "Novo Contrato"

## 📋 Passos para Testar:

### 1. **Acesse o projeto local:**
```
http://localhost:8083
```

### 2. **Limpe o localStorage (se necessário):**
- Abra o console do navegador (F12)
- Execute: `localStorage.clear()`
- Recarregue a página

### 3. **Faça login:**
- Use as credenciais:
  - **Admin**: `admin@tvdoutor.com` / `admin123`
  - **Usuário**: `user@tvdoutor.com` / `user123`

### 4. **Verifique os logs no console:**
- Abra o console do navegador (F12)
- Procure por estas mensagens:
  ```
  HomeRedirect - isAuthenticated: true isLoading: false
  Dashboard renderizado
  ```

### 5. **Teste o botão "Novo Contrato":**
- Clique no botão "Novo Contrato" na dashboard
- Verifique no console se aparecem estas mensagens:
  ```
  Botão clicado diretamente
  Botão Novo Contrato clicado
  Navegando para /contract
  ```

### 6. **Verifique a navegação:**
- A URL deve mudar para: `http://localhost:8083/contract`
- A página deve mostrar o formulário de geração de contratos

## 🔍 **Possíveis Problemas:**

### **Problema 1: Botão não responde**
- Verifique se não há erros no console
- Verifique se o JavaScript está habilitado

### **Problema 2: Navegação não funciona**
- Verifique se o React Router está funcionando
- Verifique se não há conflitos de rota

### **Problema 3: Autenticação não funciona**
- Limpe o localStorage: `localStorage.clear()`
- Faça login novamente

### **Problema 4: Página não carrega**
- Verifique se o servidor está rodando na porta 8083
- Reinicie o servidor: `npm run dev`

## 📞 **Logs de Debug Adicionados:**

- ✅ `HomeRedirect` - Verifica autenticação
- ✅ `Dashboard renderizado` - Confirma renderização
- ✅ `Botão clicado diretamente` - Confirma clique
- ✅ `Botão Novo Contrato clicado` - Confirma função
- ✅ `Navegando para /contract` - Confirma navegação

## 🚀 **URLs de Teste:**

- **Local**: http://localhost:8083
- **Vercel**: https://sistema-de-contrato-6kh1q2j04-hildebrando-cardoso-projects.vercel.app
