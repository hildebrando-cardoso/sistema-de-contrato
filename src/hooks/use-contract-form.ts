import { useState, useCallback, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { createContract, parseContractFormData, type ContractFormData } from "@/lib/contractsApi";

interface Contractor {
  contractorName: string;
  contractorCNPJ: string;
  contractorAddress: string;
  legalRepresentative: string;
  representativeCPF: string;
}

interface ContractData {
  numberOfContractors: number;
  contractors: Contractor[];
  cityState: string;
  signatureDate: string;
  contractedPlan: string;
  implementationValue: string;
  monthlyValue: string;
  paymentMethod: string;
  dueDate: string;
  contractTerm: string;
  equipment43: string;
  equipment55: string;
  players: string;
}

interface EquipmentSubtotal {
  quantity: number;
  unitValue: number;
  subtotal: number;
}

interface EquipmentSubtotals {
  equipment43: EquipmentSubtotal;
  equipment55: EquipmentSubtotal;
  players: EquipmentSubtotal;
}

// Funções de validação e formatação
const formatCNPJ = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
};

const formatCurrency = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Se não há números, retorna vazio
  if (numbers === '') return '';
  
  // Converte para número e divide por 100 para considerar centavos
  const number = parseInt(numbers, 10) / 100;
  
  // Formata como moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

const parseCurrency = (value: string): number => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Se não há números, retorna 0
  if (numbers === '') return 0;
  
  // Converte para número e divide por 100 para considerar centavos
  return parseInt(numbers, 10) / 100;
};

// Função para limpar valor monetário para cálculos
const cleanCurrencyForCalculation = (value: string): number => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Se não há números, retorna 0
  if (numbers === '') return 0;
  
  // Converte para número e divide por 100 para considerar centavos
  // Exemplo: "129,00" -> "12900" -> 129.00
  return parseInt(numbers, 10) / 100;
};

// Função para converter valor monetário para número exato
const parseExactCurrency = (value: string): number => {
  // Verificar se value é válido
  if (!value || typeof value !== 'string') {
    return 0;
  }
  
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Se não há números, retorna 0
  if (numbers === '' || numbers.length === 0) {
    return 0;
  }
  
  // Converte para número e divide por 100 para considerar centavos
  // Exemplo: "249,00" -> "24900" -> 249.00
  const parsed = parseInt(numbers, 10);
  const result = parsed / 100;
  
  // Verificar se o resultado é válido
  if (isNaN(result) || !isFinite(result)) {
    return 0;
  }
  
  return result;
};

// Funções de cálculo reestruturadas
const calculateTotalEquipmentQuantity = (equipment43: string, equipment55: string, players: string): number => {
  // Garantir que os valores são strings válidas antes de converter
  const safeEquipment43 = equipment43 || '0';
  const safeEquipment55 = equipment55 || '0';
  const safePlayers = players || '0';
  
  const qty43 = parseInt(safeEquipment43, 10) || 0;
  const qty55 = parseInt(safeEquipment55, 10) || 0;
  const qtyPlayers = parseInt(safePlayers, 10) || 0;
  
  const total = qty43 + qty55 + qtyPlayers;
  
  // Verificar se o resultado é válido
  return isNaN(total) || !isFinite(total) ? 0 : total;
};

const calculateEquipmentSubtotals = (
  equipment43: string, 
  equipment55: string, 
  players: string, 
  implementationValue: number
) => {
  // Garantir que os valores são strings válidas antes de converter
  const safeEquipment43 = equipment43 || '0';
  const safeEquipment55 = equipment55 || '0';
  const safePlayers = players || '0';
  
  const qty43 = parseInt(safeEquipment43, 10) || 0;
  const qty55 = parseInt(safeEquipment55, 10) || 0;
  const qtyPlayers = parseInt(safePlayers, 10) || 0;
  
  // Garantir que implementationValue é um número válido
  const validImplementationValue = isNaN(implementationValue) || !isFinite(implementationValue) ? 0 : implementationValue;
  
  // Calcular subtotais
  const subtotal43 = qty43 * validImplementationValue;
  const subtotal55 = qty55 * validImplementationValue;
  const subtotalPlayers = qtyPlayers * validImplementationValue;
  
  // Cálculos validados - sem logs de debug
  
  return {
    equipment43: {
      quantity: qty43,
      unitValue: validImplementationValue,
      subtotal: subtotal43
    },
    equipment55: {
      quantity: qty55,
      unitValue: validImplementationValue,
      subtotal: subtotal55
    },
    players: {
      quantity: qtyPlayers,
      unitValue: validImplementationValue,
      subtotal: subtotalPlayers
    }
  };
};

const calculateTotalImplementation = (subtotals: EquipmentSubtotals): number => {
  const total = subtotals.equipment43.subtotal + subtotals.equipment55.subtotal + subtotals.players.subtotal;
  
  // Verificar se o resultado é válido
  if (isNaN(total) || !isFinite(total)) {
    return 0;
  }
  
  return total;
};

const calculateContractTotal = (implementationValue: number, monthlyValue: number): number => {
  const total = implementationValue + monthlyValue;
  
  // Verificar se o resultado é válido
  if (isNaN(total) || !isFinite(total)) {
    return 0;
  }
  
  return total;
};

const formatCurrencyDisplay = (value: number): string => {
  // Verificar se o valor é válido
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return "R$ 0,00";
  }
  
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  } catch (error) {
    return "R$ 0,00";
  }
};

const validateCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  if (cleanCNPJ.length !== 14) return false;
  
  // Verificação básica de dígitos verificadores
  let sum = 0;
  let weight = 2;
  
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  const digit1 = sum % 11 < 2 ? 0 : 11 - sum % 11;
  sum = 0;
  weight = 2;
  
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  const digit2 = sum % 11 < 2 ? 0 : 11 - sum % 11;
  
  return parseInt(cleanCNPJ.charAt(12)) === digit1 && parseInt(cleanCNPJ.charAt(13)) === digit2;
};

const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Verificação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) digit1 = 0;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) digit2 = 0;
  
  return parseInt(cleanCPF.charAt(9)) === digit1 && parseInt(cleanCPF.charAt(10)) === digit2;
};

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    contractorName: "Nome da Contratante",
    contractorCNPJ: "CNPJ da Contratante",
    contractorAddress: "Endereço da Contratante",
    legalRepresentative: "Representante Legal",
    representativeCPF: "CPF do Representante",
    cityState: "Cidade e Estado",
    signatureDate: "Data de Assinatura",
    contractedPlan: "Plano Contratado",
    implementationValue: "Valor da Implantação",
    monthlyValue: "Plano Mensal",
    paymentMethod: "Forma de Pagamento",
    dueDate: "Data de Vencimento",
    contractTerm: "Prazo de Contrato",
    equipment43: "Equipamentos 43\"",
    equipment55: "Equipamentos 55\"",
    players: "Players",
    numberOfContractors: "Número de Contratantes",
  };
  return labels[field] || field;
};

export const useContractForm = () => {
  const [contractData, setContractData] = useState<ContractData>({
    numberOfContractors: 1,
    contractors: [{
      contractorName: "",
      contractorCNPJ: "",
      contractorAddress: "",
      legalRepresentative: "",
      representativeCPF: "",
    }],
    cityState: "",
    signatureDate: "",
    contractedPlan: "",
    implementationValue: "",
    monthlyValue: "",
    paymentMethod: "",
    dueDate: "",
    contractTerm: "12",
    equipment43: "",
    equipment55: "",
    players: "",
  });
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingToWebhook, setIsSendingToWebhook] = useState(false);

  // Cálculos reestruturados usando useMemo
  const totalEquipmentQuantity = useMemo(() => {
    return calculateTotalEquipmentQuantity(
      contractData.equipment43, 
      contractData.equipment55, 
      contractData.players
    );
  }, [contractData.equipment43, contractData.equipment55, contractData.players]);

  const userImplementationValue = useMemo(() => {
    return parseExactCurrency(contractData.implementationValue);
  }, [contractData.implementationValue]);

  const unitValue = useMemo(() => {
    if (totalEquipmentQuantity === 0) {
      return 0;
    }
    const result = userImplementationValue / totalEquipmentQuantity;
    return isNaN(result) || !isFinite(result) ? 0 : result;
  }, [userImplementationValue, totalEquipmentQuantity]);

  const equipmentSubtotals = useMemo(() => {
    return calculateEquipmentSubtotals(
      contractData.equipment43, 
      contractData.equipment55, 
      contractData.players,
      userImplementationValue
    );
  }, [contractData.equipment43, contractData.equipment55, contractData.players, userImplementationValue]);

  const calculatedImplementationValue = useMemo(() => {
    return calculateTotalImplementation(equipmentSubtotals);
  }, [equipmentSubtotals]);

  const formattedImplementationValue = useMemo(() => {
    return formatCurrencyDisplay(calculatedImplementationValue);
  }, [calculatedImplementationValue]);

  const userMonthlyValue = useMemo(() => {
    return parseExactCurrency(contractData.monthlyValue);
  }, [contractData.monthlyValue]);

  const contractTotal = useMemo(() => {
    return calculateContractTotal(calculatedImplementationValue, userMonthlyValue);
  }, [calculatedImplementationValue, userMonthlyValue]);

  const formattedContractTotal = useMemo(() => {
    return formatCurrencyDisplay(contractTotal);
  }, [contractTotal]);

  // Verificar se há diferença entre valor calculado e valor digitado
  const implementationValueDifference = useMemo(() => {
    // Não comparar valores diferentes - o valor digitado é por equipamento, o calculado é total
    return 0;
  }, [calculatedImplementationValue, userImplementationValue]);

  const hasImplementationValueMismatch = useMemo(() => {
    // Remover validação que compara valores incompatíveis
    return false;
  }, [implementationValueDifference]);

  const formProgress = useMemo(() => {
    const totalFields = 11 + (contractData.contractors.length * 5);
    let filledFields = 0;
    
    // Contar campos gerais preenchidos
    const generalFields = ['cityState', 'signatureDate', 'contractedPlan', 'implementationValue', 
      'monthlyValue', 'paymentMethod', 'dueDate', 'contractTerm', 'equipment43', 'equipment55', 'players'];
    generalFields.forEach(field => {
      if (contractData[field as keyof ContractData]) filledFields++;
    });
    
    // Contar campos dos contratantes preenchidos
    contractData.contractors.forEach(contractor => {
      Object.values(contractor).forEach(value => {
        if (value) filledFields++;
      });
    });
    
    return Math.round((filledFields / totalFields) * 100);
  }, [contractData]);

  const handleInputChange = useCallback((field: keyof ContractData, value: string) => {
    setContractData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro de validação
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });

    // Para campos de valor monetário, aplicar máscara
    if (field === 'implementationValue' || field === 'monthlyValue') {
      const formattedValue = formatCurrency(value);
      setContractData(prev => ({
        ...prev,
        [field]: formattedValue
      }));
    }
  }, []);

  const handleContractorChange = useCallback((index: number, field: keyof Contractor, value: string) => {
    setContractData(prev => ({
      ...prev,
      contractors: prev.contractors.map((contractor, i) => 
        i === index ? { ...contractor, [field]: value } : contractor
      )
    }));

    // Limpar erro de validação
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`contractor-${index}-${field}`];
      return newErrors;
    });

    // Validação em tempo real para CNPJ e CPF
    if (field === 'contractorCNPJ' && value.length >= 18) {
      if (!validateCNPJ(value)) {
        setValidationErrors(prev => ({
          ...prev,
          [`contractor-${index}-${field}`]: "CNPJ inválido"
        }));
      }
    }

    if (field === 'representativeCPF' && value.length >= 14) {
      if (!validateCPF(value)) {
        setValidationErrors(prev => ({
          ...prev,
          [`contractor-${index}-${field}`]: "CPF inválido"
        }));
      }
    }
  }, []);

  const addContractor = useCallback(() => {
    setContractData(prev => ({
      ...prev,
      numberOfContractors: prev.numberOfContractors + 1,
      contractors: [...prev.contractors, {
        contractorName: "",
        contractorCNPJ: "",
        contractorAddress: "",
        legalRepresentative: "",
        representativeCPF: "",
      }]
    }));
  }, []);

  const removeContractor = useCallback((index: number) => {
    if (contractData.numberOfContractors > 1) {
      setContractData(prev => ({
        ...prev,
        numberOfContractors: prev.numberOfContractors - 1,
        contractors: prev.contractors.filter((_, i) => i !== index)
      }));
    }
  }, [contractData.numberOfContractors]);

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    // Validate general fields
    const generalFields: (keyof Omit<ContractData, 'contractors' | 'numberOfContractors'>)[] = [
      'cityState', 'signatureDate', 'contractedPlan', 'implementationValue', 
      'monthlyValue', 'paymentMethod', 'dueDate', 'contractTerm', 
      'equipment43', 'equipment55', 'players'
    ];

    for (const field of generalFields) {
      if (!contractData[field]) {
        errors[field] = `O campo "${getFieldLabel(field)}" é obrigatório.`;
      }
    }

    // Validate contractors
    for (let i = 0; i < contractData.contractors.length; i++) {
      const contractor = contractData.contractors[i];
      const contractorFields: (keyof Contractor)[] = [
        'contractorName', 'contractorCNPJ', 'contractorAddress', 
        'legalRepresentative', 'representativeCPF'
      ];

      for (const field of contractorFields) {
        if (!contractor[field]) {
          errors[`contractor-${i}-${field}`] = `O campo "${getFieldLabel(field)}" do contratante ${i + 1} é obrigatório.`;
        }
      }

      // Validação específica de CNPJ e CPF
      if (contractor.contractorCNPJ && !validateCNPJ(contractor.contractorCNPJ)) {
        errors[`contractor-${i}-contractorCNPJ`] = "CNPJ inválido";
      }

      if (contractor.representativeCPF && !validateCPF(contractor.representativeCPF)) {
        errors[`contractor-${i}-representativeCPF`] = "CPF inválido";
      }
    }

    // Validação adicional para valores
    // Removida validação que comparava valores incompatíveis
    // O valor digitado é por equipamento, o calculado é total - não devem ser comparados

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios corretamente.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [contractData, hasImplementationValueMismatch, userImplementationValue, formattedImplementationValue]);

  const sendToWebhook = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsSendingToWebhook(true);
    
    try {
      const webhookUrl = 'https://webhook.n8n.smartdoutor.com.br/webhook/gerar-contrato-tv-doutor';
      
      // Sanitizar dados para evitar NaN
      const sanitizeValue = (value: any): number => {
        if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
          return value;
        }
        return 0;
      };
      
      const sanitizedEquipmentSubtotals = {
        equipment43: {
          quantity: sanitizeValue(equipmentSubtotals.equipment43.quantity),
          unitValue: sanitizeValue(equipmentSubtotals.equipment43.unitValue),
          subtotal: sanitizeValue(equipmentSubtotals.equipment43.subtotal)
        },
        equipment55: {
          quantity: sanitizeValue(equipmentSubtotals.equipment55.quantity),
          unitValue: sanitizeValue(equipmentSubtotals.equipment55.unitValue),
          subtotal: sanitizeValue(equipmentSubtotals.equipment55.subtotal)
        },
        players: {
          quantity: sanitizeValue(equipmentSubtotals.players.quantity),
          unitValue: sanitizeValue(equipmentSubtotals.players.unitValue),
          subtotal: sanitizeValue(equipmentSubtotals.players.subtotal)
        }
      };
      
      const dataToSend = {
        contractData: {
          ...contractData,
          equipmentSubtotals: sanitizedEquipmentSubtotals,
          calculatedImplementationValue: sanitizeValue(calculatedImplementationValue),
          formattedImplementationValue,
          contractTotal: sanitizeValue(contractTotal),
          formattedContractTotal,
          unitValue: sanitizeValue(unitValue),
          totalEquipmentQuantity: sanitizeValue(totalEquipmentQuantity),
          // Valores limpos para cálculos
          cleanImplementationValue: sanitizeValue(userImplementationValue),
          cleanMonthlyValue: sanitizeValue(userMonthlyValue)
        },
        timestamp: new Date().toISOString(),
        source: 'Sistema de Contrato - TV Doutor'
      };
      
      // Dados sanitizados e prontos para envio
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast({
          title: "Dados enviados com sucesso!",
          description: "Iniciando processamento do contrato...",
        });
        
        return { success: true };
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao enviar para webhook:', error);
      toast({
        title: "Erro ao enviar dados",
        description: "Ocorreu um erro ao enviar os dados para o webhook. Tente novamente.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSendingToWebhook(false);
    }
  }, [contractData, validateForm, equipmentSubtotals, calculatedImplementationValue, formattedImplementationValue, contractTotal, formattedContractTotal, unitValue, totalEquipmentQuantity, userImplementationValue, userMonthlyValue]);

  const generateContract = useCallback(async () => {
    if (!validateForm()) {
      return { success: false };
    }

    setIsGenerating(true);
    
    try {
      // Gerar texto do contrato
      const contractorsList = contractData.contractors.map((contractor, index) => 
        `CONTRATANTE ${index + 1}: ${contractor.contractorName}
CNPJ: ${contractor.contractorCNPJ}
ENDEREÇO: ${contractor.contractorAddress}
REPRESENTANTE LEGAL: ${contractor.legalRepresentative}
CPF: ${contractor.representativeCPF}`
      ).join('\n\n');

      const generatedContract = `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS
PROGRAMA "${contractData.contractedPlan.toUpperCase()}"

${contractorsList}

CIDADE/ESTADO: ${contractData.cityState}
DATA: ${contractData.signatureDate}

PLANO CONTRATADO: ${contractData.contractedPlan}

VALORES:
- Implantação: ${contractData.implementationValue}
- Plano Mensal: ${contractData.monthlyValue}
- Total do Contrato: ${formattedContractTotal}

FORMA DE PAGAMENTO: ${contractData.paymentMethod}
DATA DE VENCIMENTO: ${contractData.dueDate}
PRAZO DE CONTRATO: ${contractData.contractTerm} meses (renovação automática)

EQUIPAMENTOS (COMODATO):
- Monitores 43": ${contractData.equipment43} unidades (${formatCurrencyDisplay(equipmentSubtotals.equipment43.subtotal || 0)})
- Monitores 55": ${contractData.equipment55} unidades (${formatCurrencyDisplay(equipmentSubtotals.equipment55.subtotal || 0)})
- Players: ${contractData.players} unidades (${formatCurrencyDisplay(equipmentSubtotals.players.subtotal || 0)})

[Aqui seria inserido o texto completo do contrato com as 19 cláusulas e Anexo I]
      `.trim();

      // Converter dados do formulário para o formato do banco
      const contractDataForDB = parseContractFormData(contractData as ContractFormData);
      contractDataForDB.generated_contract_text = generatedContract;

      // Salvar no Supabase
      const result = await createContract(contractDataForDB);
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao salvar contrato');
      }

      toast({
        title: "Contrato salvo com sucesso!",
        description: "O contrato foi gerado e salvo no sistema.",
      });

      return { 
        success: true, 
        contract: generatedContract, 
        data: contractData, 
        contractId: result.contractId 
      };
    } catch (error: any) {
      console.error('Erro ao gerar/salvar contrato:', error);
      toast({
        title: "Erro ao gerar contrato",
        description: error.message || "Ocorreu um erro durante a geração. Tente novamente.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsGenerating(false);
    }
  }, [contractData, validateForm, equipmentSubtotals, formattedContractTotal]);

  return {
    contractData,
    validationErrors,
    isGenerating,
    isSendingToWebhook,
    formProgress,
    handleInputChange,
    handleContractorChange,
    addContractor,
    removeContractor,
    validateForm,
    sendToWebhook,
    generateContract,
    formatCNPJ,
    formatCPF,
    formatCurrency,
    parseCurrency,
    cleanCurrencyForCalculation,
    parseExactCurrency,
    // Valores calculados reestruturados
    equipmentSubtotals,
    calculatedImplementationValue,
    formattedImplementationValue,
    userImplementationValue,
    userMonthlyValue,
    contractTotal,
    formattedContractTotal,
    hasImplementationValueMismatch,
    implementationValueDifference,
    unitValue,
    totalEquipmentQuantity,
  };
}; 