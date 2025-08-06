import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { ContractForm } from "@/components/ContractForm";
import { ContractPreview } from "@/components/ContractPreview";
import { Button } from "@/components/ui/button";
import { Shield, User } from "lucide-react";

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

const Index = () => {
  const [generatedContract, setGeneratedContract] = useState<string | null>(null);
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleContractGenerated = (contract: string, data: ContractData) => {
    setGeneratedContract(contract);
    setContractData(data);
  };

  const handleBackToForm = () => {
    setGeneratedContract(null);
    setContractData(null);
  };

  const handleDashboardAccess = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-light/10 to-accent/20">
      <Header />
      
      {/* Botão de acesso ao dashboard */}
      <div className="container mx-auto px-4 pt-4">
        <div className="flex justify-end">
          <Button
            onClick={handleDashboardAccess}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                <span>Dashboard</span>
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                <span>Entrar</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        {generatedContract && contractData ? (
          <ContractPreview 
            contract={generatedContract} 
            contractData={contractData}
            onBack={handleBackToForm}
          />
        ) : (
          <ContractForm onContractGenerated={handleContractGenerated} />
        )}
      </main>
      
      <footer className="text-center py-6 text-muted-foreground text-sm border-t border-border/50">
        <p>© 2025 TV Doutor - Sistema de Geração de Contratos</p>
      </footer>
    </div>
  );
};

export default Index;
