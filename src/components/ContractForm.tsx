import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Send, AlertCircle, Calculator, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContractForm } from "@/hooks/use-contract-form";
import { FormProgressIndicator } from "@/components/FormProgressIndicator";

interface ContractFormProps {
  onContractGenerated: (contract: string, data: any) => void;
}

// Componente de resumo de valores
const ValueSummary = ({ 
  equipmentSubtotals, 
  calculatedImplementationValue, 
  formattedImplementationValue,
  userImplementationValue,
  userMonthlyValue,
  contractTotal,
  formattedContractTotal,
  hasImplementationValueMismatch,
  unitValue,
  totalEquipmentQuantity
}: any) => {
  // Função para formatar valores monetários de forma segura
  const formatCurrency = (value: number) => {
    if (isNaN(value) || !isFinite(value)) {
      return "R$ 0,00";
    }
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
          <Calculator className="h-5 w-5" />
          Resumo de Valores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações do cálculo */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-blue-700">Informações do Cálculo:</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Total de equipamentos:</span>
              <span className="font-medium">{totalEquipmentQuantity} unidades</span>
            </div>
            <div className="flex justify-between">
              <span>Valor da implantação por equipamento:</span>
              <span className="font-medium">
                {formatCurrency(userImplementationValue)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Valor total da implantação:</span>
              <span className="font-medium">
                {formatCurrency(calculatedImplementationValue)}
              </span>
            </div>
          </div>
        </div>

        {/* Subtotais por equipamento */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-blue-700">Subtotais por Equipamento:</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Equipamentos 43" ({equipmentSubtotals.equipment43.quantity} un.):</span>
              <span className="font-medium">
                {formatCurrency(equipmentSubtotals.equipment43.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Equipamentos 55" ({equipmentSubtotals.equipment55.quantity} un.):</span>
              <span className="font-medium">
                {formatCurrency(equipmentSubtotals.equipment55.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Players ({equipmentSubtotals.players.quantity} un.):</span>
              <span className="font-medium">
                {formatCurrency(equipmentSubtotals.players.subtotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Valor calculado vs digitado */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-blue-700">Valor de Implantação:</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Valor calculado:</span>
              <span className="font-medium text-green-600">{formattedImplementationValue}</span>
            </div>
            <div className="flex justify-between">
              <span>Valor digitado por equipamento:</span>
              <span className="font-medium">
                {formatCurrency(userImplementationValue)}
              </span>
            </div>
            {hasImplementationValueMismatch && (
              <div className="flex items-center gap-1 text-orange-600 text-xs">
                <Info className="h-3 w-3" />
                <span>Diferença detectada - verifique os valores</span>
              </div>
            )}
          </div>
        </div>

        {/* Total do contrato */}
        <div className="pt-3 border-t border-blue-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-blue-800">Total do Contrato:</span>
            <span className="text-lg font-bold text-blue-800">{formattedContractTotal}</span>
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Implantação + Plano Mensal
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ContractForm = ({ onContractGenerated }: ContractFormProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  
  const {
    contractData,
    validationErrors,
    isGenerating,
    isSendingToWebhook,
    formProgress,
    handleInputChange,
    handleContractorChange,
    addContractor,
    removeContractor,
    sendToWebhook,
    generateContract,
    formatCNPJ,
    formatCPF,
    // Valores calculados reestruturados
    equipmentSubtotals,
    calculatedImplementationValue,
    formattedImplementationValue,
    userImplementationValue,
    userMonthlyValue,
    contractTotal,
    formattedContractTotal,
    hasImplementationValueMismatch,
    unitValue,
    totalEquipmentQuantity
  } = useContractForm();

  const handleSendToWebhook = async () => {
    const result = await sendToWebhook();
    if (result?.success) {
      navigate('/processing');
    }
  };

  const handleGenerateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await generateContract();
    if (result?.success && result.contract) {
      onContractGenerated(result.contract, result.data);
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
          
          {/* Indicador de Progresso Melhorado */}
          <FormProgressIndicator 
            progress={formProgress}
            currentTab={activeTab}
            validationErrors={validationErrors}
          />
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleGenerateContract} className="space-y-6">
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
                      <SelectTrigger className={cn(
                        "border-medical-primary/20 focus:border-medical-primary",
                        validationErrors.contractedPlan && "border-red-500"
                      )}>
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cuidar-educar-especialidades">
                          Cuidar e Educar – Especialidades
                        </SelectItem>
                        <SelectItem value="cuidar-educar-exclusivo">
                          Cuidar e Educar – Exclusivo
                        </SelectItem>
                        <SelectItem value="cuidar-educar-padrao">
                          Cuidar e Educar – Padrão
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.contractedPlan && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors.contractedPlan}
                      </p>
                    )}
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
                      className={cn(
                        "border-medical-primary/20 focus:border-medical-primary",
                        validationErrors.signatureDate && "border-red-500"
                      )}
                      required
                      aria-describedby={validationErrors.signatureDate ? "signatureDate-error" : undefined}
                    />
                    {validationErrors.signatureDate && (
                      <p id="signatureDate-error" className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors.signatureDate}
                      </p>
                    )}
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
                      className={cn(
                        "border-medical-primary/20 focus:border-medical-primary",
                        validationErrors.cityState && "border-red-500"
                      )}
                      required
                      aria-describedby={validationErrors.cityState ? "cityState-error" : undefined}
                    />
                    {validationErrors.cityState && (
                      <p id="cityState-error" className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors.cityState}
                      </p>
                    )}
                  </div>
                </div>

                {/* Valores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="implementationValue" className="text-sm font-medium text-foreground">
                      Valor da Implantação por equipamento *
                    </Label>
                    <Input
                      id="implementationValue"
                      value={contractData.implementationValue}
                      onChange={(e) => handleInputChange('implementationValue', e.target.value)}
                      placeholder="R$ 0,00"
                      className={cn(
                        "border-medical-primary/20 focus:border-medical-primary",
                        validationErrors.implementationValue && "border-red-500"
                      )}
                      required
                      aria-describedby={validationErrors.implementationValue ? "implementationValue-error" : "implementationValue-info"}
                    />
                    {validationErrors.implementationValue && (
                      <p id="implementationValue-error" className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors.implementationValue}
                      </p>
                    )}
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
                      className={cn(
                        "border-medical-primary/20 focus:border-medical-primary",
                        validationErrors.monthlyValue && "border-red-500"
                      )}
                      required
                      aria-describedby={validationErrors.monthlyValue ? "monthlyValue-error" : undefined}
                    />
                    {validationErrors.monthlyValue && (
                      <p id="monthlyValue-error" className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors.monthlyValue}
                      </p>
                    )}
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
                      <SelectTrigger className={cn(
                        "border-medical-primary/20 focus:border-medical-primary",
                        validationErrors.paymentMethod && "border-red-500"
                      )}>
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cartao">Cartão</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="boleto">Boleto</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.paymentMethod && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors.paymentMethod}
                      </p>
                    )}
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
                      className={cn(
                        "border-medical-primary/20 focus:border-medical-primary",
                        validationErrors.dueDate && "border-red-500"
                      )}
                      required
                      aria-describedby={validationErrors.dueDate ? "dueDate-error" : undefined}
                    />
                    {validationErrors.dueDate && (
                      <p id="dueDate-error" className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors.dueDate}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contractTerm" className="text-sm font-medium text-foreground">
                      Prazo de Contrato *
                    </Label>
                    <Select 
                      value={contractData.contractTerm}
                      onValueChange={(value) => handleInputChange('contractTerm', value)}
                    >
                      <SelectTrigger className={cn(
                        "border-medical-primary/20 focus:border-medical-primary",
                        validationErrors.contractTerm && "border-red-500"
                      )}>
                        <SelectValue placeholder="Selecione o prazo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 meses (renovação automática)</SelectItem>
                        <SelectItem value="24">24 meses (renovação automática)</SelectItem>
                        <SelectItem value="36">36 meses (renovação automática)</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.contractTerm && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors.contractTerm}
                      </p>
                    )}
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
                            className={cn(
                              "border-medical-primary/20 focus:border-medical-primary",
                              validationErrors[`contractor-${index}-contractorName`] && "border-red-500"
                            )}
                            required
                            aria-describedby={validationErrors[`contractor-${index}-contractorName`] ? `contractorName-${index}-error` : undefined}
                          />
                          {validationErrors[`contractor-${index}-contractorName`] && (
                            <p id={`contractorName-${index}-error`} className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              {validationErrors[`contractor-${index}-contractorName`]}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`contractorCNPJ-${index}`} className="text-sm font-medium text-foreground">
                            CNPJ da CONTRATANTE *
                          </Label>
                          <Input
                            id={`contractorCNPJ-${index}`}
                            value={contractor.contractorCNPJ}
                            onChange={(e) => {
                              const formatted = formatCNPJ(e.target.value);
                              handleContractorChange(index, 'contractorCNPJ', formatted);
                            }}
                            placeholder="00.000.000/0000-00"
                            className={cn(
                              "border-medical-primary/20 focus:border-medical-primary",
                              validationErrors[`contractor-${index}-contractorCNPJ`] && "border-red-500"
                            )}
                            required
                            maxLength={18}
                            aria-describedby={validationErrors[`contractor-${index}-contractorCNPJ`] ? `contractorCNPJ-${index}-error` : undefined}
                          />
                          {validationErrors[`contractor-${index}-contractorCNPJ`] && (
                            <p id={`contractorCNPJ-${index}-error`} className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              {validationErrors[`contractor-${index}-contractorCNPJ`]}
                            </p>
                          )}
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
                          className={cn(
                            "border-medical-primary/20 focus:border-medical-primary",
                            validationErrors[`contractor-${index}-contractorAddress`] && "border-red-500"
                          )}
                          rows={3}
                          required
                          aria-describedby={validationErrors[`contractor-${index}-contractorAddress`] ? `contractorAddress-${index}-error` : undefined}
                        />
                        {validationErrors[`contractor-${index}-contractorAddress`] && (
                          <p id={`contractorAddress-${index}-error`} className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {validationErrors[`contractor-${index}-contractorAddress`]}
                          </p>
                        )}
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
                            className={cn(
                              "border-medical-primary/20 focus:border-medical-primary",
                              validationErrors[`contractor-${index}-legalRepresentative`] && "border-red-500"
                            )}
                            required
                            aria-describedby={validationErrors[`contractor-${index}-legalRepresentative`] ? `legalRepresentative-${index}-error` : undefined}
                          />
                          {validationErrors[`contractor-${index}-legalRepresentative`] && (
                            <p id={`legalRepresentative-${index}-error`} className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              {validationErrors[`contractor-${index}-legalRepresentative`]}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`representativeCPF-${index}`} className="text-sm font-medium text-foreground">
                            CPF do Representante *
                          </Label>
                          <Input
                            id={`representativeCPF-${index}`}
                            value={contractor.representativeCPF}
                            onChange={(e) => {
                              const formatted = formatCPF(e.target.value);
                              handleContractorChange(index, 'representativeCPF', formatted);
                            }}
                            placeholder="000.000.000-00"
                            className={cn(
                              "border-medical-primary/20 focus:border-medical-primary",
                              validationErrors[`contractor-${index}-representativeCPF`] && "border-red-500"
                            )}
                            required
                            maxLength={14}
                            aria-describedby={validationErrors[`contractor-${index}-representativeCPF`] ? `representativeCPF-${index}-error` : undefined}
                          />
                          {validationErrors[`contractor-${index}-representativeCPF`] && (
                            <p id={`representativeCPF-${index}-error`} className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              {validationErrors[`contractor-${index}-representativeCPF`]}
                            </p>
                          )}
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
                      className={cn(
                        "border-medical-primary/20 focus:border-medical-primary",
                        validationErrors.equipment43 && "border-red-500"
                      )}
                      min="0"
                      required
                      aria-describedby={validationErrors.equipment43 ? "equipment43-error" : undefined}
                    />
                    {validationErrors.equipment43 && (
                      <p id="equipment43-error" className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors.equipment43}
                      </p>
                    )}
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
                      className={cn(
                        "border-medical-primary/20 focus:border-medical-primary",
                        validationErrors.equipment55 && "border-red-500"
                      )}
                      min="0"
                      required
                      aria-describedby={validationErrors.equipment55 ? "equipment55-error" : undefined}
                    />
                    {validationErrors.equipment55 && (
                      <p id="equipment55-error" className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors.equipment55}
                      </p>
                    )}
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
                      className={cn(
                        "border-medical-primary/20 focus:border-medical-primary",
                        validationErrors.players && "border-red-500"
                      )}
                      min="0"
                      required
                      aria-describedby={validationErrors.players ? "players-error" : undefined}
                    />
                    {validationErrors.players && (
                      <p id="players-error" className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors.players}
                      </p>
                    )}
                  </div>
                </div>

                {/* Resumo de Valores */}
                <ValueSummary 
                  equipmentSubtotals={equipmentSubtotals}
                  calculatedImplementationValue={calculatedImplementationValue}
                  formattedImplementationValue={formattedImplementationValue}
                  userImplementationValue={userImplementationValue}
                  userMonthlyValue={userMonthlyValue}
                  contractTotal={contractTotal}
                  formattedContractTotal={formattedContractTotal}
                  hasImplementationValueMismatch={hasImplementationValueMismatch}
                  unitValue={unitValue}
                  totalEquipmentQuantity={totalEquipmentQuantity}
                />

                <div className="pt-6 border-t border-medical-primary/10">
                  <Button
                    type="button"
                    onClick={handleSendToWebhook}
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