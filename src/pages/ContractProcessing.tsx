import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { useContractProcessing } from "@/hooks/use-contract-processing";
import { 
  Clock, 
  CheckCircle, 
  Download, 
  ArrowLeft, 
  FileText,
  Loader2,
  AlertCircle
} from "lucide-react";

const ContractProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { status, simulateProcessing } = useContractProcessing();

  // Iniciar o processo de simulação
  useEffect(() => {
    simulateProcessing();
  }, [simulateProcessing]);

  // Mostrar toast quando o contrato for concluído
  useEffect(() => {
    if (status.status === 'completed') {
      toast({
        title: "Contrato pronto!",
        description: "Seu contrato foi gerado e está pronto para download.",
      });
    }
  }, [status.status]);

  const handleDownload = () => {
    if (status.downloadUrl) {
      // Abrir o link do PDF em uma nova aba
      window.open(status.downloadUrl, '_blank');

      toast({
        title: "Link aberto",
        description: "O link do contrato foi aberto em uma nova aba.",
      });
    }
  };

  const handleBackToForm = () => {
    navigate('/contract');
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case 'processing':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'processing':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-light/10 to-accent/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="backdrop-blur-sm bg-card/95 border-medical-primary/20 shadow-xl">
            <CardHeader className="text-center border-b border-medical-primary/10">
              <CardTitle className="text-2xl font-bold text-medical-primary flex items-center justify-center gap-3">
                <FileText className="h-6 w-6" />
                Processamento do Contrato
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Aguarde enquanto geramos seu contrato
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Status Icon */}
                <div className="flex justify-center">
                  {getStatusIcon()}
                </div>

                {/* Status Message */}
                <div className="space-y-2">
                  <h3 className={`text-lg font-semibold ${getStatusColor()}`}>
                    {status.message}
                  </h3>
                  {status.status === 'error' && status.errorMessage && (
                    <p className="text-sm text-muted-foreground">
                      {status.errorMessage}
                    </p>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progresso</span>
                    <span>{status.progress}%</span>
                  </div>
                  <Progress value={status.progress} className="h-2" />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {status.status === 'completed' ? (
                    <>
                      <Button
                        onClick={handleDownload}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 h-12 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Baixar Contrato (PDF)
                      </Button>
                      <Button
                        onClick={handleBackToForm}
                        variant="outline"
                        className="flex-1 border-medical-primary/20 text-medical-primary hover:bg-medical-primary/10"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Gerar Novo Contrato
                      </Button>
                    </>
                  ) : status.status === 'error' ? (
                    <Button
                      onClick={handleBackToForm}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 h-12 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Tentar Novamente
                    </Button>
                  ) : (
                    <Button
                      onClick={handleBackToForm}
                      variant="outline"
                      className="w-full border-medical-primary/20 text-medical-primary hover:bg-medical-primary/10"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Voltar ao Formulário
                    </Button>
                  )}
                </div>

                {/* Additional Information */}
                {status.status === 'processing' && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">O que está acontecendo?</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Seus dados foram enviados para o sistema n8n</li>
                          <li>• O sistema está processando as informações</li>
                          <li>• O contrato está sendo gerado com todas as cláusulas</li>
                          <li>• O PDF será criado e disponibilizado para download</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {status.status === 'completed' && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="text-sm text-green-800">
                        <p className="font-medium mb-1">Contrato gerado com sucesso!</p>
                        <p className="text-xs">
                          Seu contrato foi processado e está pronto para download. 
                          O arquivo contém todas as cláusulas necessárias e está 
                          formatado conforme os padrões da TV Doutor.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="text-center py-6 text-muted-foreground text-sm border-t border-border/50">
        <p>© 2025 TV Doutor - Sistema de Geração de Contratos</p>
      </footer>
    </div>
  );
};

export default ContractProcessing; 