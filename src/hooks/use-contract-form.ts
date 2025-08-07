import { useState, useCallback, useMemo } from "react";
import { toast } from "@/hooks/use-toast";

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
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Se não há números, retorna 0
  if (numbers === '') return 0;
  
  // Converte para número exato (não divide por 100)
  // Exemplo: "129,00" -> "12900" -> 12900
  return parseInt(numbers, 10);
};

// Funções de cálculo
const calculateTotalPoints = (equipment43: string, equipment55: string, players: string): number => {
  const points43 = parseInt(equipment43) || 0;
  const points55 = parseInt(equipment55) || 0;
  const pointsPlayers = parseInt(players) || 0;
  
  return points43 + points55 + pointsPlayers;
};

const calculateImplementationValue = (totalPoints: number, unitValue: number): number => {
  return totalPoints * unitValue;
};

const formatCurrencyDisplay = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
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

  // Memoizar valores calculados
  // Cálculos computados
  const totalPoints = useMemo(() => {
    return calculateTotalPoints(contractData.equipment43, contractData.equipment55, contractData.players);
  }, [contractData.equipment43, contractData.equipment55, contractData.players]);

  const unitValue = useMemo(() => {
    // Calcular valor unitário baseado no valor da implantação digitado pelo usuário
    const implementationValueNumber = parseExactCurrency(contractData.implementationValue);
    const totalPointsNumber = totalPoints;
    
    if (totalPointsNumber > 0 && implementationValueNumber > 0) {
      return implementationValueNumber / totalPointsNumber;
    }
    
    return 0; // Valor padrão se não houver dados suficientes
  }, [contractData.implementationValue, totalPoints]);

  const calculatedImplementationValue = useMemo(() => {
    return calculateImplementationValue(totalPoints, unitValue);
  }, [totalPoints, unitValue]);

  const formattedImplementationValue = useMemo(() => {
    return formatCurrencyDisplay(calculatedImplementationValue);
  }, [calculatedImplementationValue]);

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

    // Lógica para calcular valores baseados no plano selecionado
    if (field === 'contractedPlan') {
      let monthlyValue = "";

      if (value === "cuidar-educar-especialidades") {
        monthlyValue = "R$ 0,00";
      } else if (value === "cuidar-educar-exclusivo") {
        monthlyValue = "R$ 199,00";
      } else if (value === "cuidar-educar-padrao") {
        monthlyValue = "R$ 0,00";
      }

      setContractData(prev => ({
        ...prev,
        monthlyValue
      }));
    }

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
  }, [contractData]);

  const sendToWebhook = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsSendingToWebhook(true);
    
    try {
      const webhookUrl = 'https://webhook.n8n.smartdoutor.com.br/webhook/gerar-contrato-tv-doutor';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractData: {
            ...contractData,
            totalPoints: totalPoints || 0,
            unitValue: unitValue || 0,
            calculatedImplementationValue: calculatedImplementationValue || 0,
            formattedImplementationValue: formattedImplementationValue || 'R$ 0,00',
            // Valores limpos para cálculos
            cleanImplementationValue: parseExactCurrency(contractData.implementationValue),
            cleanUnitValue: unitValue || 0
          },
          timestamp: new Date().toISOString(),
          source: 'Sistema de Contrato - TV Doutor'
        }),
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
  }, [contractData, validateForm, totalPoints, unitValue, calculatedImplementationValue, formattedImplementationValue, cleanCurrencyForCalculation, parseExactCurrency]);

  const generateContract = useCallback(async () => {
    if (!validateForm()) {
      return { success: false };
    }

    setIsGenerating(true);
    
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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

FORMA DE PAGAMENTO: ${contractData.paymentMethod}
DATA DE VENCIMENTO: ${contractData.dueDate}
PRAZO DE CONTRATO: ${contractData.contractTerm} meses (renovação automática)

EQUIPAMENTOS (COMODATO):
- Monitores 43": ${contractData.equipment43} unidades
- Monitores 55": ${contractData.equipment55} unidades  
- Players: ${contractData.players} unidades

[Aqui seria inserido o texto completo do contrato com as 19 cláusulas e Anexo I]
      `.trim();

      toast({
        title: "Contrato gerado com sucesso!",
        description: "O contrato foi gerado e está pronto para visualização.",
      });

      return { success: true, contract: generatedContract, data: contractData };
    } catch (error) {
      toast({
        title: "Erro ao gerar contrato",
        description: "Ocorreu um erro durante a geração. Tente novamente.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsGenerating(false);
    }
  }, [contractData, validateForm]);

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
    // Valores calculados
    totalPoints,
    unitValue,
    calculatedImplementationValue,
    formattedImplementationValue,
  };
}; 