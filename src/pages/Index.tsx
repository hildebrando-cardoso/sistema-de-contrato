import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Layout } from "@/components/Layout";
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
    <Layout title="Geração de Contratos" subtitle="Sistema de Contratos Digitais - TV Doutor">
      {generatedContract && contractData ? (
        <ContractPreview 
          contract={generatedContract} 
          contractData={contractData}
          onBack={handleBackToForm}
        />
      ) : (
        <ContractForm onContractGenerated={handleContractGenerated} />
      )}
    </Layout>
  );
};

export default Index;
