import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, Send } from "lucide-react";

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

interface ContractFormProps {
  onContractGenerated: (contract: string, data: ContractData) => void;
}

export const ContractForm = ({ onContractGenerated }: ContractFormProps) => {
  const navigate = useNavigate();
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
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingToWebhook, setIsSendingToWebhook] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleInputChange = (field: keyof ContractData, value: string) => {
    setContractData(prev => ({
      ...prev,
      [field]: value
    }));

    // Lógica para calcular valores baseados no plano selecionado
    if (field === 'contractedPlan') {
      const implementationValue = "R$ 249,00"; // Valor fixo por ponto
      let monthlyValue = "";

      if (value === "cuidar-educar-especialidades") {
        monthlyValue = "R$ 0,00";
      } else if (value === "cuidar-educar-exclusivo") {
        monthlyValue = "R$ 199,00";
      }

      setContractData(prev => ({
        ...prev,
        implementationValue,
        monthlyValue
      }));
    }
  };

  const handleContractorChange = (index: number, field: keyof Contractor, value: string) => {
    setContractData(prev => ({
      ...prev,
      contractors: prev.contractors.map((contractor, i) => 
        i === index ? { ...contractor, [field]: value } : contractor
      )
    }));
  };

  const addContractor = () => {
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
  };

  const removeContractor = (index: number) => {
    if (contractData.numberOfContractors > 1) {
      setContractData(prev => ({
        ...prev,
        numberOfContractors: prev.numberOfContractors - 1,
        contractors: prev.contractors.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = (): boolean => {
    // Validate general fields
    const generalFields: (keyof Omit<ContractData, 'contractors' | 'numberOfContractors'>)[] = [
      'cityState', 'signatureDate', 'contractedPlan', 'implementationValue', 
      'monthlyValue', 'paymentMethod', 'dueDate', 'contractTerm', 
      'equipment43', 'equipment55', 'players'
    ];

    for (const field of generalFields) {
      if (!contractData[field]) {
        toast({
          title: "Campo obrigatório",
          description: `O campo "${getFieldLabel(field)}" é obrigatório.`,
          variant: "destructive",
        });
        setActiveTab("general");
        return false;
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
          toast({
            title: "Campo obrigatório",
            description: `O campo "${getFieldLabel(field)}" do contratante ${i + 1} é obrigatório.`,
            variant: "destructive",
          });
          setActiveTab("contractors");
          return false;
        }
      }
    }
    return true;
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

  const sendToWebhook = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSendingToWebhook(true);
    
    try {
      const webhookUrl = 'https://webhook.n8n.smartdoutor.com.br/webhook-test/gerar-contrato-tv-doutor';
      
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

      if (response.ok) {
        toast({
          title: "Dados enviados com sucesso!",
          description: "Iniciando processamento do contrato...",
        });
        
        // Redirecionar para a tela de processamento
        navigate('/processing');
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
    } finally {
      setIsSendingToWebhook(false);
    }
  };

  const generateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
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

      onContractGenerated(generatedContract, contractData);
      
      toast({
        title: "Contrato gerado com sucesso!",
        description: "O contrato foi gerado e está pronto para visualização.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar contrato",
        description: "Ocorreu um erro durante a geração. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="backdrop-blur-sm bg-card/95 border-medical-primary/20 shadow-xl">
        <CardHeader className="text-center border-b border-medical-primary/10">
          <CardTitle className="text-3xl font-bold text-medical-primary">
            Geração de Contrato - TV Doutor
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Sistema de Contratos Digitais
          </p>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={generateContract} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Dados Gerais</TabsTrigger>
                <TabsTrigger value="contractors">Contratantes</TabsTrigger>
                <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
              </TabsList>

              {/* Tab: Dados Gerais */}
              <TabsContent value="general" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contractedPlan" className="text-sm font-medium text-foreground">
                      Plano Contratado *
                    </Label>
                    <Select 
                      value={contractData.contractedPlan}
                      onValueChange={(value) => handleInputChange('contractedPlan', value)}
                    >
                      <SelectTrigger className="border-medical-primary/20 focus:border-medical-primary">
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cuidar-educar-especialidades">
                          Cuidar e Educar – Especialidades
                        </SelectItem>
                        <SelectItem value="cuidar-educar-exclusivo">
                          Cuidar e Educar – Exclusivo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signatureDate" className="text-sm font-medium text-foreground">
                      Data de Assinatura *
                    </Label>
                    <Input
                      id="signatureDate"
                      type="date"
                      value={contractData.signatureDate}
                      onChange={(e) => handleInputChange('signatureDate', e.target.value)}
                      className="border-medical-primary/20 focus:border-medical-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cityState" className="text-sm font-medium text-foreground">
                      Cidade e Estado *
                    </Label>
                    <Input
                      id="cityState"
                      value={contractData.cityState}
                      onChange={(e) => handleInputChange('cityState', e.target.value)}
                      placeholder="Ex: São Paulo, SP"
                      className="border-medical-primary/20 focus:border-medical-primary"
                      required
                    />
                  </div>
                </div>

                {/* Valores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="implementationValue" className="text-sm font-medium text-foreground">
                      Valor da Implantação *
                    </Label>
                    <Input
                      id="implementationValue"
                      value={contractData.implementationValue}
                      onChange={(e) => handleInputChange('implementationValue', e.target.value)}
                      placeholder="R$ 249,00"
                      className="border-medical-primary/20 focus:border-medical-primary"
                      required
                      readOnly
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="monthlyValue" className="text-sm font-medium text-foreground">
                      Plano Mensal *
                    </Label>
                    <Input
                      id="monthlyValue"
                      value={contractData.monthlyValue}
                      onChange={(e) => handleInputChange('monthlyValue', e.target.value)}
                      placeholder="R$ 0,00"
                      className="border-medical-primary/20 focus:border-medical-primary"
                      required
                      readOnly
                    />
                  </div>
                </div>

                {/* Forma de Pagamento, Data de Vencimento e Prazo de Contrato */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod" className="text-sm font-medium text-foreground">
                      Forma de Pagamento *
                    </Label>
                    <Select 
                      value={contractData.paymentMethod}
                      onValueChange={(value) => handleInputChange('paymentMethod', value)}
                    >
                      <SelectTrigger className="border-medical-primary/20 focus:border-medical-primary">
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cartao">Cartão</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="boleto">Boleto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-sm font-medium text-foreground">
                      Data de Vencimento *
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={contractData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="border-medical-primary/20 focus:border-medical-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contractTerm" className="text-sm font-medium text-foreground">
                      Prazo de Contrato *
                    </Label>
                    <Select 
                      value={contractData.contractTerm}
                      onValueChange={(value) => handleInputChange('contractTerm', value)}
                    >
                      <SelectTrigger className="border-medical-primary/20 focus:border-medical-primary">
                        <SelectValue placeholder="Selecione o prazo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 meses (renovação automática)</SelectItem>
                        <SelectItem value="24">24 meses (renovação automática)</SelectItem>
                        <SelectItem value="36">36 meses (renovação automática)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Tab: Contratantes */}
              <TabsContent value="contractors" className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Contratantes ({contractData.numberOfContractors})
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addContractor}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Contratante
                  </Button>
                </div>

                <div className="space-y-6">
                  {contractData.contractors.map((contractor, index) => (
                    <Card key={index} className="p-6 border-medical-primary/10">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-medium text-foreground">
                          Contratante {index + 1}
                        </h4>
                        {contractData.numberOfContractors > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeContractor(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`contractorName-${index}`} className="text-sm font-medium text-foreground">
                            Nome da CONTRATANTE *
                          </Label>
                          <Input
                            id={`contractorName-${index}`}
                            value={contractor.contractorName}
                            onChange={(e) => handleContractorChange(index, 'contractorName', e.target.value)}
                            placeholder="Digite o nome da empresa contratante"
                            className="border-medical-primary/20 focus:border-medical-primary"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`contractorCNPJ-${index}`} className="text-sm font-medium text-foreground">
                            CNPJ da CONTRATANTE *
                          </Label>
                          <Input
                            id={`contractorCNPJ-${index}`}
                            value={contractor.contractorCNPJ}
                            onChange={(e) => handleContractorChange(index, 'contractorCNPJ', e.target.value)}
                            placeholder="00.000.000/0000-00"
                            className="border-medical-primary/20 focus:border-medical-primary"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <Label htmlFor={`contractorAddress-${index}`} className="text-sm font-medium text-foreground">
                          Endereço completo da CONTRATANTE *
                        </Label>
                        <Textarea
                          id={`contractorAddress-${index}`}
                          value={contractor.contractorAddress}
                          onChange={(e) => handleContractorChange(index, 'contractorAddress', e.target.value)}
                          placeholder="Digite o endereço completo"
                          className="border-medical-primary/20 focus:border-medical-primary"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor={`legalRepresentative-${index}`} className="text-sm font-medium text-foreground">
                            Nome do Representante Legal *
                          </Label>
                          <Input
                            id={`legalRepresentative-${index}`}
                            value={contractor.legalRepresentative}
                            onChange={(e) => handleContractorChange(index, 'legalRepresentative', e.target.value)}
                            placeholder="Digite o nome do representante"
                            className="border-medical-primary/20 focus:border-medical-primary"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`representativeCPF-${index}`} className="text-sm font-medium text-foreground">
                            CPF do Representante *
                          </Label>
                          <Input
                            id={`representativeCPF-${index}`}
                            value={contractor.representativeCPF}
                            onChange={(e) => handleContractorChange(index, 'representativeCPF', e.target.value)}
                            placeholder="000.000.000-00"
                            className="border-medical-primary/20 focus:border-medical-primary"
                            required
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Tab: Equipamentos */}
              <TabsContent value="equipment" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="equipment43" className="text-sm font-medium text-foreground">
                      Quantidade de Equipamentos 43" *
                    </Label>
                    <Input
                      id="equipment43"
                      type="number"
                      value={contractData.equipment43}
                      onChange={(e) => handleInputChange('equipment43', e.target.value)}
                      placeholder="0"
                      className="border-medical-primary/20 focus:border-medical-primary"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="equipment55" className="text-sm font-medium text-foreground">
                      Quantidade de Equipamentos 55" *
                    </Label>
                    <Input
                      id="equipment55"
                      type="number"
                      value={contractData.equipment55}
                      onChange={(e) => handleInputChange('equipment55', e.target.value)}
                      placeholder="0"
                      className="border-medical-primary/20 focus:border-medical-primary"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="players" className="text-sm font-medium text-foreground">
                      Quantidade de Players *
                    </Label>
                    <Input
                      id="players"
                      type="number"
                      value={contractData.players}
                      onChange={(e) => handleInputChange('players', e.target.value)}
                      placeholder="0"
                      className="border-medical-primary/20 focus:border-medical-primary"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-medical-primary/10">
                  <Button
                    type="button"
                    onClick={sendToWebhook}
                    disabled={isSendingToWebhook}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 h-12 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSendingToWebhook ? "Enviando..." : "Gerar Contrato"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};