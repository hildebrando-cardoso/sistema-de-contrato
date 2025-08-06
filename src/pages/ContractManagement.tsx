import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Eye, Download, Edit, Trash2, Plus, Calendar, MapPin, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Contract {
  id: string;
  contractorName: string;
  location: string;
  date: string;
  status: "aprovado" | "pendente" | "rejeitado";
  value: string;
  plan: "cuidar-educar-especialidades" | "cuidar-educar-exclusivo";
  user: string;
  contractors: Array<{
    contractorName: string;
    contractorCNPJ: string;
    contractorAddress: string;
    legalRepresentative: string;
    representativeCPF: string;
  }>;
  equipment: {
    equipment43: string;
    equipment55: string;
    players: string;
  };
  paymentMethod: string;
  dueDate: string;
  contractTerm: string;
}

const mockContracts: Contract[] = [
  {
    id: "1",
    contractorName: "Hospital São Lucas",
    location: "São Paulo, SP",
    date: "14/01/2024",
    status: "aprovado",
    value: "R$ 50.000,00",
    plan: "cuidar-educar-especialidades",
    user: "admin@tv-doutor.com",
    contractors: [{
      contractorName: "Hospital São Lucas",
      contractorCNPJ: "12.345.678/0001-90",
      contractorAddress: "Rua das Flores, 123 - São Paulo, SP",
      legalRepresentative: "Dr. João Silva",
      representativeCPF: "123.456.789-00"
    }],
    equipment: {
      equipment43: "5",
      equipment55: "3",
      players: "8"
    },
    paymentMethod: "cartao",
    dueDate: "15/01/2024",
    contractTerm: "12"
  },
  {
    id: "2",
    contractorName: "Clínica Médica Central",
    location: "Rio de Janeiro, RJ",
    date: "19/01/2024",
    status: "pendente",
    value: "R$ 35.000,00",
    plan: "cuidar-educar-exclusivo",
    user: "maria@clinica.com",
    contractors: [{
      contractorName: "Clínica Médica Central",
      contractorCNPJ: "98.765.432/0001-10",
      contractorAddress: "Av. Copacabana, 456 - Rio de Janeiro, RJ",
      legalRepresentative: "Dra. Maria Santos",
      representativeCPF: "987.654.321-00"
    }],
    equipment: {
      equipment43: "3",
      equipment55: "2",
      players: "5"
    },
    paymentMethod: "pix",
    dueDate: "20/01/2024",
    contractTerm: "24"
  },
  {
    id: "3",
    contractorName: "Instituto de Saúde",
    location: "Belo Horizonte, MG",
    date: "24/01/2024",
    status: "rejeitado",
    value: "R$ 42.000,00",
    plan: "cuidar-educar-especialidades",
    user: "pedro@instituto.com",
    contractors: [{
      contractorName: "Instituto de Saúde",
      contractorCNPJ: "11.222.333/0001-44",
      contractorAddress: "Rua da Liberdade, 789 - Belo Horizonte, MG",
      legalRepresentative: "Dr. Pedro Oliveira",
      representativeCPF: "111.222.333-44"
    }],
    equipment: {
      equipment43: "4",
      equipment55: "2",
      players: "6"
    },
    paymentMethod: "boleto",
    dueDate: "25/01/2024",
    contractTerm: "36"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "aprovado":
      return "bg-green-100 text-green-800 border-green-200";
    case "pendente":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "rejeitado":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "aprovado":
      return "Aprovado";
    case "pendente":
      return "Pendente";
    case "rejeitado":
      return "Rejeitado";
    default:
      return status;
  }
};

const getPlanText = (plan: string) => {
  switch (plan) {
    case "cuidar-educar-especialidades":
      return "Cuidar e Educar – Especialidades";
    case "cuidar-educar-exclusivo":
      return "Cuidar e Educar – Exclusivo";
    default:
      return plan;
  }
};

export const ContractManagement = () => {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.contractorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (contract: Contract) => {
    setSelectedContract(contract);
  };

  const handleDownloadContract = (contract: Contract) => {
    // Simular download do contrato
    const contractText = `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS
PROGRAMA "${contract.plan.toUpperCase()}"

CONTRATANTE: ${contract.contractorName}
CNPJ: ${contract.contractors[0]?.contractorCNPJ}
ENDEREÇO: ${contract.contractors[0]?.contractorAddress}
REPRESENTANTE LEGAL: ${contract.contractors[0]?.legalRepresentative}
CPF: ${contract.contractors[0]?.representativeCPF}

LOCALIZAÇÃO: ${contract.location}
DATA: ${contract.date}
VALOR: ${contract.value}
STATUS: ${getStatusText(contract.status)}

EQUIPAMENTOS:
- Monitores 43": ${contract.equipment.equipment43} unidades
- Monitores 55": ${contract.equipment.equipment55} unidades
- Players: ${contract.equipment.players} unidades

FORMA DE PAGAMENTO: ${contract.paymentMethod}
DATA DE VENCIMENTO: ${contract.dueDate}
PRAZO DE CONTRATO: ${contract.contractTerm} meses
    `;

    const blob = new Blob([contractText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contrato-${contract.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout title="Gerenciar Contratos" subtitle="Visualize e gerencie todos os contratos do sistema">
      {/* Header com busca e filtros */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar contratos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="">Todos os status</option>
            <option value="aprovado">Aprovado</option>
            <option value="pendente">Pendente</option>
            <option value="rejeitado">Rejeitado</option>
          </select>
          
          <Button variant="outline" className="flex items-center gap-2 text-sm">
            <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
          
          <Button className="flex items-center gap-2 text-sm">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Novo Contrato</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>
      </div>

      {/* Lista de Contratos */}
      <div className="grid gap-3 sm:gap-4">
        {filteredContracts.map((contract) => (
          <Card key={contract.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">
                        {contract.contractorName}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                          {contract.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          ID: {contract.id} • {contract.date}
                        </span>
                      </div>
                    </div>
                    <Badge className={cn("border text-xs", getStatusColor(contract.status))}>
                      {getStatusText(contract.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                      {contract.value}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                      {getPlanText(contract.plan)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(contract)}
                        className="flex items-center gap-2 text-xs"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Ver Detalhes</span>
                        <span className="sm:hidden">Ver</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Detalhes do Contrato #{contract.id}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <Tabs defaultValue="general" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                            <TabsTrigger value="general">Geral</TabsTrigger>
                            <TabsTrigger value="contractors">Contratantes</TabsTrigger>
                            <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
                            <TabsTrigger value="financial">Financeiro</TabsTrigger>
                          </TabsList>

                          <TabsContent value="general" className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Informações Básicas</h4>
                                <div className="space-y-2 text-sm">
                                  <div><strong>Nome:</strong> {contract.contractorName}</div>
                                  <div><strong>Localização:</strong> {contract.location}</div>
                                  <div><strong>Data:</strong> {contract.date}</div>
                                  <div><strong>Status:</strong> 
                                    <Badge className={cn("ml-2", getStatusColor(contract.status))}>
                                      {getStatusText(contract.status)}
                                    </Badge>
                                  </div>
                                  <div><strong>Plano:</strong> {getPlanText(contract.plan)}</div>
                                  <div><strong>Valor:</strong> {contract.value}</div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Usuário Responsável</h4>
                                <div className="text-sm">
                                  <div><strong>Email:</strong> {contract.user}</div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="contractors" className="space-y-4">
                            <h4 className="font-semibold">Contratantes</h4>
                            {contract.contractors.map((contractor, index) => (
                              <Card key={index} className="p-4">
                                <div className="space-y-2 text-sm">
                                  <div><strong>Nome:</strong> {contractor.contractorName}</div>
                                  <div><strong>CNPJ:</strong> {contractor.contractorCNPJ}</div>
                                  <div><strong>Endereço:</strong> {contractor.contractorAddress}</div>
                                  <div><strong>Representante Legal:</strong> {contractor.legalRepresentative}</div>
                                  <div><strong>CPF:</strong> {contractor.representativeCPF}</div>
                                </div>
                              </Card>
                            ))}
                          </TabsContent>

                          <TabsContent value="equipment" className="space-y-4">
                            <h4 className="font-semibold">Equipamentos (Comodato)</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-medical-primary">
                                  {contract.equipment.equipment43}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Monitores 43"
                                </div>
                              </div>
                              <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-medical-primary">
                                  {contract.equipment.equipment55}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Monitores 55"
                                </div>
                              </div>
                              <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-medical-primary">
                                  {contract.equipment.players}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Players
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="financial" className="space-y-4">
                            <h4 className="font-semibold">Informações Financeiras</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2 text-sm">
                                <div><strong>Valor Total:</strong> {contract.value}</div>
                                <div><strong>Forma de Pagamento:</strong> {contract.paymentMethod}</div>
                                <div><strong>Data de Vencimento:</strong> {contract.dueDate}</div>
                                <div><strong>Prazo do Contrato:</strong> {contract.contractTerm} meses</div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadContract(contract)}
                    className="flex items-center gap-2 text-xs"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden">Baixar</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-xs"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Editar</span>
                    <span className="sm:hidden">Editar</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Excluir</span>
                    <span className="sm:hidden">Excluir</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContracts.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-muted-foreground">Nenhum contrato encontrado.</p>
        </div>
      )}
    </Layout>
  );
}; 