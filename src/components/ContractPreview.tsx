import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Send, Signature, FileText, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  monitorValue: string;
  playerValue: string;
  equipment43: string;
  equipment55: string;
  players: string;
}

interface ContractPreviewProps {
  contract: string;
  contractData: ContractData;
  onBack: () => void;
}

export const ContractPreview = ({ contract, contractData, onBack }: ContractPreviewProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownloadPDF = async () => {
    setIsProcessing(true);
    try {
      // Simulação do download do PDF
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Download iniciado!",
        description: "O contrato está sendo baixado em PDF.",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o contrato. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDigitalSignature = async () => {
    setIsProcessing(true);
    try {
      // Simulação da integração com serviço de assinatura digital
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Assinatura digital iniciada!",
        description: "Você será redirecionado para o serviço de assinatura.",
      });
    } catch (error) {
      toast({
        title: "Erro na assinatura",
        description: "Não foi possível iniciar a assinatura digital. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, informe um endereço de email válido.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Simulação do envio por email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Email enviado!",
        description: `Contrato enviado para ${email} com sucesso.`,
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar o email. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Formulário
        </Button>
        
        <div className="flex gap-2">
          <Button
            onClick={handleDownloadPDF}
            disabled={isProcessing}
            variant="outline"
            size="sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          
          <Button
            onClick={handleDigitalSignature}
            disabled={isProcessing}
            variant="outline"
            size="sm"
          >
            <Signature className="mr-2 h-4 w-4" />
            Assinatura Digital
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Send className="mr-2 h-4 w-4" />
                Enviar por Email
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enviar Contrato por Email</DialogTitle>
                <DialogDescription>
                  Digite o endereço de email para envio do contrato.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Endereço de Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                  />
                </div>
                <Button 
                  onClick={handleSendEmail}
                  disabled={isProcessing}
                  className="w-full"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isProcessing ? "Enviando..." : "Enviar Contrato"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-primary flex items-center justify-center gap-2">
            <FileText className="h-5 w-5" />
            Contrato Gerado - {contractData.contractedPlan}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-accent/20 rounded-lg p-6 border-2 border-dashed border-accent">
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-foreground">
              {contract}
            </pre>
          </div>
          
          <div className="mt-6 p-4 bg-medical-light/10 rounded-lg border border-medical-primary/20">
            <h4 className="font-semibold text-medical-primary mb-4">Dados do Contrato:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <div><strong>Cidade/Estado:</strong> {contractData.cityState}</div>
              <div><strong>Data:</strong> {contractData.signatureDate}</div>
              <div><strong>Plano:</strong> {contractData.contractedPlan}</div>
              <div><strong>Equipamentos 43":</strong> {contractData.equipment43}</div>
              <div><strong>Equipamentos 55":</strong> {contractData.equipment55}</div>
              <div><strong>Players:</strong> {contractData.players}</div>
              <div><strong>Implantação:</strong> R$ {contractData.implementationValue}</div>
              <div><strong>Mensalidade:</strong> R$ {contractData.monthlyValue}</div>
            </div>
            
            <h5 className="text-md font-semibold mb-3 text-medical-primary">
              Contratante{contractData.contractors.length > 1 ? 's' : ''} ({contractData.contractors.length})
            </h5>
            <div className="space-y-4">
              {contractData.contractors.map((contractor, index) => (
                <div key={index} className="p-4 bg-white/50 rounded border border-medical-primary/10">
                  <h6 className="font-medium mb-2">Contratante {index + 1}</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div><strong>Nome:</strong> {contractor.contractorName}</div>
                    <div><strong>CNPJ:</strong> {contractor.contractorCNPJ}</div>
                    <div><strong>Representante:</strong> {contractor.legalRepresentative}</div>
                    <div><strong>CPF:</strong> {contractor.representativeCPF}</div>
                    <div className="md:col-span-2"><strong>Endereço:</strong> {contractor.contractorAddress}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};