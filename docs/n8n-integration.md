# Integração com n8n - Sistema de Contratos TV Doutor

## Visão Geral

O sistema de contratos foi projetado para trabalhar em conjunto com o n8n para processar e gerar contratos automaticamente. O fluxo funciona da seguinte forma:

1. **Formulário de Dados**: Usuário preenche os dados do contrato
2. **Envio para n8n**: Dados são enviados via webhook para o n8n
3. **Processamento**: n8n processa os dados e gera o contrato
4. **Resposta**: n8n responde com o link do PDF gerado

## Configuração do n8n

### 1. Webhook de Entrada

Configure um webhook no n8n para receber os dados do formulário:

```json
{
  "contractData": {
    "numberOfContractors": 1,
    "contractors": [
      {
        "contractorName": "Empresa Exemplo LTDA",
        "contractorCNPJ": "00.000.000/0000-00",
        "contractorAddress": "Rua Exemplo, 123",
        "legalRepresentative": "João Silva",
        "representativeCPF": "000.000.000-00"
      }
    ],
    "cityState": "São Paulo, SP",
    "signatureDate": "2025-01-15",
    "contractedPlan": "cuidar-educar-especialidades",
    "implementationValue": "R$ 249,00",
    "monthlyValue": "R$ 0,00",
    "paymentMethod": "pix",
    "dueDate": "2025-01-15",
    "contractTerm": "12",
    "equipment43": "2",
    "equipment55": "1",
    "players": "3"
  },
  "timestamp": "2025-01-15T10:30:00.000Z",
  "source": "Sistema de Contrato - TV Doutor"
}
```

### 2. Node de Espera (Wait Node)

Após receber os dados, adicione um node de espera para simular o processamento:

```javascript
// Configuração do Wait Node
{
  "waitTime": 10000, // 10 segundos
  "waitTimeUnit": "ms"
}
```

### 3. Processamento do Contrato

Adicione nodes para:
- Validar dados recebidos
- Gerar template do contrato
- Aplicar formatação
- Gerar PDF

### 4. Webhook de Resposta

Configure um webhook de saída para responder ao sistema:

```json
{
  "status": "success",
  "message": "Contrato gerado com sucesso",
  "downloadUrl": "https://storage.example.com/contracts/contrato-123.pdf",
  "contractId": "contract-123",
  "timestamp": "2025-01-15T10:30:10.000Z"
}
```

## Implementação no Sistema

### 1. Envio de Dados

O sistema envia dados via POST para o webhook do n8n:

```typescript
const response = await fetch(webhookUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contractData,
    timestamp: new Date().toISOString(),
    source: 'Sistema de Contrato - TV Doutor'
  }),
});
```

### 2. Verificação de Status

Para verificar o status do processamento, implemente polling:

```typescript
const checkContractStatus = async (contractId: string) => {
  const response = await fetch(`/api/contract-status/${contractId}`);
  const data = await response.json();
  
  if (data.status === 'completed') {
    // Contrato pronto
    return data;
  }
  
  // Continuar polling
  return null;
};
```

### 3. Recebimento da Resposta

O n8n deve responder com:

```typescript
interface WebhookResponse {
  status: 'success' | 'error';
  message: string;
  downloadUrl?: string;
  contractId?: string;
  error?: string;
}
```

## Configurações Recomendadas

### 1. Timeout do Processamento

Configure um timeout adequado no n8n:
- **Tempo de espera**: 30-60 segundos
- **Retry em caso de falha**: 3 tentativas
- **Log de erros**: Ativo

### 2. Armazenamento de PDFs

Configure armazenamento seguro para os PDFs:
- **Google Drive** ou **Dropbox** para armazenamento
- **URLs públicas** para download
- **Expiração automática** após 30 dias

### 3. Validação de Dados

Implemente validação no n8n:
- Verificar campos obrigatórios
- Validar formato de CNPJ/CPF
- Verificar se planos são válidos

## Exemplo de Workflow n8n

```
Webhook Input → Validate Data → Wait → Generate Contract → Create PDF → Upload to Storage → Webhook Output
```

### Nodes Necessários:

1. **Webhook** - Receber dados
2. **Set** - Validar e preparar dados
3. **Wait** - Simular processamento
4. **Code** - Gerar contrato
5. **Google Drive** - Salvar PDF
6. **Webhook** - Responder com link

## Tratamento de Erros

### 1. Erros de Validação

```json
{
  "status": "error",
  "message": "Dados inválidos",
  "error": "CNPJ inválido",
  "contractId": null
}
```

### 2. Erros de Processamento

```json
{
  "status": "error",
  "message": "Erro ao gerar contrato",
  "error": "Falha na geração do PDF",
  "contractId": "contract-123"
}
```

## Monitoramento

### 1. Logs do n8n

Configure logs detalhados para:
- Dados recebidos
- Tempo de processamento
- Erros ocorridos
- PDFs gerados

### 2. Métricas

Acompanhe:
- Taxa de sucesso
- Tempo médio de processamento
- Erros mais comuns
- Uso de recursos

## Segurança

### 1. Autenticação

Implemente autenticação no webhook:
- API Key no header
- Validação de origem
- Rate limiting

### 2. Dados Sensíveis

- Não logar CPF/CNPJ
- Criptografar dados em trânsito
- Limpar dados temporários

## Próximos Passos

1. **Implementar webhook real** no n8n
2. **Configurar armazenamento** de PDFs
3. **Adicionar validações** robustas
4. **Implementar retry** automático
5. **Configurar monitoramento** e alertas 