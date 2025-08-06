# Sistema de Geração de Contratos - TV Doutor

Sistema completo para geração e gerenciamento de contratos do programa "Cuidar e Educar" da TV Doutor.

## 🚀 Funcionalidades

### Sistema de Autenticação
- **Login/Registro**: Sistema completo de autenticação
- **Proteção de Rotas**: Rotas protegidas que requerem autenticação
- **Níveis de Acesso**: Suporte para usuários e administradores
- **Persistência**: Sessão mantida no localStorage

### Dashboard Administrativo
- **Visão Geral**: Estatísticas e métricas do sistema
- **Gerenciamento de Contratos**: Lista e busca de contratos
- **Interface Responsiva**: Design adaptável para diferentes dispositivos
- **Navegação Intuitiva**: Menu lateral com diferentes seções

### Geração de Contratos
- **Formulário Dinâmico**: Interface para preenchimento de dados
- **Preview em Tempo Real**: Visualização do contrato antes da geração
- **Validação de Dados**: Verificação de campos obrigatórios
- **Exportação**: Geração de contratos em formato PDF

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **React Router** para navegação
- **Tailwind CSS** para estilização
- **Shadcn/ui** para componentes
- **Lucide React** para ícones
- **React Hook Form** para formulários
- **Zod** para validação

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd sistema-de-contrato
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
# ou
bun install
```

3. Execute o projeto:
```bash
npm run dev
# ou
yarn dev
# ou
bun dev
```

## 🔐 Credenciais de Teste

### Administrador
- **Email**: admin@tvdoutor.com
- **Senha**: admin123

### Usuário
- **Email**: user@tvdoutor.com
- **Senha**: user123

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/            # Componentes base (shadcn/ui)
│   ├── Header.tsx     # Cabeçalho principal
│   ├── ContractForm.tsx
│   ├── ContractPreview.tsx
│   └── ProtectedRoute.tsx
├── contexts/          # Contextos React
│   └── AuthContext.tsx
├── pages/             # Páginas da aplicação
│   ├── Index.tsx      # Página principal
│   ├── Login.tsx      # Página de login
│   ├── Dashboard.tsx  # Dashboard administrativo
│   └── NotFound.tsx
├── hooks/             # Hooks customizados
├── lib/               # Utilitários
└── assets/            # Recursos estáticos
```

## 🚀 Rotas Disponíveis

- `/` - Página principal (pública)
- `/login` - Página de login/registro (pública)
- `/dashboard` - Dashboard administrativo (protegida)
- `/admin` - Dashboard com acesso apenas para administradores
- `/processing` - Processamento de contratos (pública)

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🎨 Design System

O projeto utiliza um design system baseado em:
- **Cores**: Paleta médica com tons de azul e verde
- **Tipografia**: Sistema de fontes hierárquico
- **Componentes**: Biblioteca shadcn/ui para consistência
- **Responsividade**: Design mobile-first

## 🔒 Segurança

- Autenticação baseada em contexto React
- Proteção de rotas com redirecionamento automático
- Validação de formulários no cliente
- Persistência segura de sessão

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)

## 🚀 Deploy

Para fazer deploy do projeto:

1. Gere o build de produção:
```bash
npm run build
```

2. Os arquivos estarão na pasta `dist/`

3. Faça upload para seu servidor web ou plataforma de hosting

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas, entre em contato com a equipe de desenvolvimento da TV Doutor.

---

**Desenvolvido com ❤️ pela equipe TV Doutor**
