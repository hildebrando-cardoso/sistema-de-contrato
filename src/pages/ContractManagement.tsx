import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, Eye, Download, Edit, Trash2, Plus, Calendar, MapPin, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchContracts, type ContractRow, type ContractStatus } from "@/lib/contractsApi";
import { toast } from "@/hooks/use-toast";

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "approved":
      return "Aprovado";
    case "pending":
      return "Pendente";
    case "rejected":
      return "Rejeitado";
    case "draft":
      return "Rascunho";
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
    case "cuidar-educar-padrao":
      return "Cuidar e Educar – Padrão";
    default:
      return plan;
  }
};

const formatBRL = (value: number | null) => {
  if (!value) return "R$ 0,00";
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const ContractManagement = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "">("");
  const [selectedContract, setSelectedContract] = useState<ContractRow | null>(null);

  const handleNewContract = () => {
    navigate('/contract');
  };

  // Carregar contratos
  const loadContracts = async () => {
    try {
      setLoading(true);
      const data = await searchContracts({
        q: searchTerm || null,
        status: statusFilter || null,
        limit: 50,
        offset: 0
      });
      setContracts(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar contratos",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, [searchTerm, statusFilter]);

  const handleViewDetails = (contract: ContractRow) => {
    setSelectedContract(contract);
  };

  const handleDownloadContract = (contract: ContractRow) => {
    const contractText = `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS
PROGRAMA "${contract.plan_contracted?.toUpperCase()}"

CONTRATANTE: ${contract.title}
LOCALIZAÇÃO: ${contract.city}, ${contract.state}
DATA: ${contract.signature_date ? new Date(contract.signature_date).toLocaleDateString('pt-BR') : 'N/A'}
VALOR MENSAL: ${formatBRL(contract.monthly_plan_value)}
VALOR TOTAL: ${formatBRL(contract.total_contract_value)}
STATUS: ${getStatusText(contract.status_enum)}

[Texto completo do contrato seria inserido aqui]
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
            onChange={(e) => setStatusFilter(e.target.value as ContractStatus | "")}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="">Todos os status</option>
            <option value="approved">Aprovado</option>
            <option value="pending">Pendente</option>
            <option value="rejected">Rejeitado</option>
            <option value="draft">Rascunho</option>
          </select>
          
          <Button variant="outline" className="flex items-center gap-2 text-sm">
            <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
          
          <Button 
            onClick={handleNewContract}
            className="flex items-center gap-2 text-sm"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Novo Contrato</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>
      </div>

      {/* Lista de Contratos */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {contracts.map((contract) => (
            <Card key={contract.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-foreground">
                          {contract.title || 'Sem título'}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                            {contract.city}, {contract.state}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            ID: {contract.id.slice(0, 8)}... • {contract.signature_date ? new Date(contract.signature_date).toLocaleDateString('pt-BR') : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <Badge className={cn("border text-xs", getStatusColor(contract.status_enum))}>
                        {getStatusText(contract.status_enum)}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                        {formatBRL(contract.total_contract_value)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                        {getPlanText(contract.plan_contracted || '')}
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
                          <DialogTitle>Detalhes do Contrato #{contract.id.slice(0, 8)}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Informações Básicas</h4>
                              <div className="space-y-2 text-sm">
                                <div><strong>Título:</strong> {contract.title || 'Sem título'}</div>
                                <div><strong>Localização:</strong> {contract.city}, {contract.state}</div>
                                <div><strong>Data:</strong> {contract.signature_date ? new Date(contract.signature_date).toLocaleDateString('pt-BR') : 'N/A'}</div>
                                <div><strong>Status:</strong> 
                                  <Badge className={cn("ml-2", getStatusColor(contract.status_enum))}>
                                    {getStatusText(contract.status_enum)}
                                  </Badge>
                                </div>
                                <div><strong>Plano:</strong> {getPlanText(contract.plan_contracted || '')}</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Informações Financeiras</h4>
                              <div className="space-y-2 text-sm">
                                <div><strong>Valor Mensal:</strong> {formatBRL(contract.monthly_plan_value)}</div>
                                <div><strong>Valor Total:</strong> {formatBRL(contract.total_contract_value)}</div>
                              </div>
                            </div>
                          </div>
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
      )}

      {!loading && contracts.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-muted-foreground">Nenhum contrato encontrado.</p>
        </div>
      )}
    </Layout>
  );
};