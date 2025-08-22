# Lógica de Cálculo - Sistema de Contratos TV Doutor

## Visão Geral

O sistema foi reestruturado para implementar cálculos baseados no valor da implantação digitado pelo usuário. O valor da implantação é multiplicado pela quantidade de equipamentos para obter o valor total da implantação.

## Nova Lógica de Cálculo

### 1. Cálculo do Total de Equipamentos

```typescript
const calculateTotalEquipmentQuantity = (equipment43: string, equipment55: string, players: string): number => {
  const qty43 = parseInt(equipment43) || 0;
  const qty55 = parseInt(equipment55) || 0;
  const qtyPlayers = parseInt(players) || 0;
  
  return qty43 + qty55 + qtyPlayers;
};
```

### 2. Cálculo dos Subtotais

Para cada tipo de equipamento, o sistema calcula:
- **Quantidade** × **Valor da Implantação** = **Subtotal**

```typescript
const calculateEquipmentSubtotals = (
  equipment43: string, 
  equipment55: string, 
  players: string, 
  implementationValue: number
) => {
  const qty43 = parseInt(equipment43) || 0;
  const qty55 = parseInt(equipment55) || 0;
  const qtyPlayers = parseInt(players) || 0;
  
  return {
    equipment43: {
      quantity: qty43,
      unitValue: implementationValue, // Valor da implantação por equipamento
      subtotal: qty43 * implementationValue
    },
    equipment55: {
      quantity: qty55,
      unitValue: implementationValue, // Valor da implantação por equipamento
      subtotal: qty55 * implementationValue
    },
    players: {
      quantity: qtyPlayers,
      unitValue: implementationValue, // Valor da implantação por equipamento
      subtotal: qtyPlayers * implementationValue
    }
  };
};
```

### 3. Exemplo de Cálculo

**Cenário:**
- Valor da implantação digitado: R$ 249,00 por equipamento
- Equipamentos 43": 5 unidades
- Equipamentos 55": 3 unidades
- Players: 5 unidades

**Cálculos:**
1. **Total de equipamentos:** 5 + 3 + 5 = 13 unidades
2. **Subtotais:**
   - Equipamentos 43": 5 × R$ 249,00 = R$ 1.245,00
   - Equipamentos 55": 3 × R$ 249,00 = R$ 747,00
   - Players: 5 × R$ 249,00 = R$ 1.245,00
3. **Total calculado:** R$ 1.245,00 + R$ 747,00 + R$ 1.245,00 = R$ 3.237,00

## Validação de Consistência

### Verificação de Diferença

O sistema **não compara** o valor digitado com o valor calculado, pois são valores diferentes:
- **Valor digitado**: Valor da implantação **por equipamento**
- **Valor calculado**: Soma total de todos os subtotais

Esses valores não devem ser comparados pois representam conceitos diferentes.

```typescript
// Validação removida - valores incompatíveis
const implementationValueDifference = 0;
const hasImplementationValueMismatch = false;
```

### Alertas

- O sistema não exibe alertas de diferença entre valores
- A validação permite o envio do formulário normalmente
- O usuário pode confiar nos cálculos exibidos no resumo

## Planos Disponíveis

### Todos os Planos Permitem Digitação Manual

- **Cuidar e Educar – Especialidades**: Usuário digita o valor mensal
- **Cuidar e Educar – Exclusivo**: Usuário digita o valor mensal  
- **Cuidar e Educar – Padrão**: Usuário digita o valor mensal

### Remoção da Lógica Hardcoded

A lógica anterior que definia valores fixos foi removida:
```typescript
// REMOVIDO - Lógica anterior
if (value === "cuidar-educar-especialidades") {
  monthlyValue = "R$ 0,00";
} else if (value === "cuidar-educar-exclusivo") {
  monthlyValue = "R$ 199,00";
} else if (value === "cuidar-educar-padrao") {
  monthlyValue = "R$ 0,00";
}
```

## Interface de Usuário

### Componente de Resumo de Valores

O sistema agora exibe um componente que mostra:

1. **Informações do Cálculo**:
   - Total de equipamentos
   - Valor da implantação por equipamento
   - Valor total da implantação

2. **Subtotais por Equipamento**:
   - Quantidade e valor de cada tipo de equipamento
   - Formatação em moeda brasileira

3. **Valor de Implantação**:
   - Valor calculado automaticamente
   - Valor digitado por equipamento
   - Alerta de diferença se aplicável

4. **Total do Contrato**:
   - Soma de implantação + plano mensal
   - Destaque visual do valor total

### Exemplo de Exibição

```
Informações do Cálculo:
Total de equipamentos: 13 unidades
Valor da implantação por equipamento: R$ 249,00
Valor total da implantação: R$ 3.237,00

Subtotais por Equipamento:
Equipamentos 43" (5 un.): R$ 1.245,00
Equipamentos 55" (3 un.): R$ 747,00
Players (5 un.): R$ 1.245,00

Valor de Implantação:
Valor calculado: R$ 3.237,00
Valor digitado por equipamento: R$ 249,00

Total do Contrato: R$ 3.436,00
Implantação + Plano Mensal
```

## Benefícios da Nova Implementação

### ✅ Cálculos Consistentes
- Valor da implantação multiplicado pela quantidade
- Todos os equipamentos recebem o mesmo valor por unidade
- Cálculos previsíveis e diretos

### ✅ Flexibilidade
- Usuário pode digitar valor mensal para qualquer plano
- Sistema adaptável a diferentes cenários
- Validação de consistência

### ✅ Transparência
- Exibição clara de todos os cálculos
- Separação entre valores calculados e digitados
- Interface intuitiva para o usuário

### ✅ Simplicidade
- Lógica mais simples e direta
- Menos confusão para o usuário
- Cálculos previsíveis

## Fluxo de Cálculo

1. **Usuário digita:**
   - Valor da implantação por equipamento
   - Quantidades de equipamentos
   - Valor do plano mensal

2. **Sistema calcula:**
   - Total de equipamentos
   - Subtotais = Quantidade × Valor da implantação
   - Total da implantação = Soma dos subtotais
   - **Total do contrato = Total da implantação + Valor do plano mensal**

3. **Sistema valida:**
   - Se o valor calculado está próximo do valor digitado
   - Se todos os campos obrigatórios estão preenchidos

## Próximas Melhorias Sugeridas

1. **Configuração Dinâmica**: Permitir ajuste de valores via interface administrativa
2. **Histórico de Valores**: Manter histórico de valores utilizados
3. **Múltiplas Moedas**: Suporte a diferentes moedas
4. **Descontos**: Implementar sistema de descontos
5. **Impostos**: Adicionar cálculo de impostos
