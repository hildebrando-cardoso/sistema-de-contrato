# Sistema de Contratos - TV Doutor

Sistema web para geração de contratos da TV Doutor, desenvolvido com React, TypeScript e Tailwind CSS. Integra com n8n para processamento automático de contratos.

## Funcionalidades

- ✅ Formulário completo para coleta de dados do contrato
- ✅ Validação de campos obrigatórios
- ✅ Integração com n8n via webhook
- ✅ Tela de processamento em tempo real
- ✅ Geração automática de contrato
- ✅ Preview do contrato gerado
- ✅ Interface responsiva e moderna
- ✅ Sistema de notificações
- ✅ Download de PDF (após processamento)

## Tecnologias

- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Vite
- React Router
- n8n (integração)

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
├── components/     # Componentes React
│   ├── ui/        # Componentes de UI (shadcn/ui)
│   ├── ContractForm.tsx
│   ├── ContractPreview.tsx
│   ├── Header.tsx
│   └── ProcessingSteps.tsx
├── pages/         # Páginas da aplicação
│   ├── Index.tsx
│   ├── ContractProcessing.tsx
│   └── NotFound.tsx
├── hooks/         # Hooks personalizados
│   ├── use-contract-processing.ts
│   └── use-toast.ts
├── lib/           # Utilitários
└── assets/        # Recursos estáticos
```

## Fluxo de Funcionamento

### 1. Preenchimento do Formulário
- Usuário preenche todos os dados necessários
- Sistema valida campos obrigatórios
- Dados são organizados por categorias (Geral, Contratantes, Equipamentos)

### 2. Envio para Processamento
- Ao clicar em "Gerar Contrato", dados são enviados para n8n
- Sistema redireciona para tela de processamento
- Usuário vê progresso em tempo real

### 3. Processamento no n8n
- n8n recebe dados via webhook
- Processa informações e gera contrato
- Aplica formatação e assinaturas
- Gera PDF e salva em storage

### 4. Conclusão
- n8n responde com link do PDF
- Sistema mostra botão de download
- Usuário pode baixar contrato finalizado

## Configuração do n8n

Veja a documentação completa em `docs/n8n-integration.md` para:
- Configuração do webhook
- Estrutura de dados
- Tratamento de erros
- Monitoramento

## Uso

1. **Acesse a aplicação** no navegador
2. **Preencha o formulário** com todos os dados obrigatórios
3. **Clique em "Gerar Contrato"** para iniciar o processamento
4. **Aguarde o processamento** na tela de status
5. **Baixe o PDF** quando o processamento for concluído

## Desenvolvimento

### Novas Funcionalidades

- **Tela de Processamento**: Mostra status em tempo real
- **Integração n8n**: Envio e recebimento de dados
- **Hook Personalizado**: `useContractProcessing` para gerenciar estado
- **Componente de Etapas**: `ProcessingSteps` para visualização detalhada

### Próximos Passos

1. Implementar webhook real no n8n
2. Configurar armazenamento de PDFs
3. Adicionar autenticação
4. Implementar retry automático
5. Configurar monitoramento

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

Este projeto é privado da TV Doutor.
