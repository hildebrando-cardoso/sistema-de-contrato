import { useState } from "react";
import { Header } from "@/components/Header";
import { ContractForm } from "@/components/ContractForm";
import { ContractPreview } from "@/components/ContractPreview";

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

  const handleContractGenerated = (contract: string, data: ContractData) => {
    setGeneratedContract(contract);
    setContractData(data);
  };

  const handleBackToForm = () => {
    setGeneratedContract(null);
    setContractData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-light/10 to-accent/20">
      <Header />
      
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
