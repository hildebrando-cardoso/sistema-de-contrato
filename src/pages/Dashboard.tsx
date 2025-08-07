import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Plus,
  Calendar,
  DollarSign
} from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleNewContract = () => {
    navigate('/contract');
  };

  const handleViewCalendar = () => {
    navigate('/contracts');
  };

  const handleViewReports = () => {
    navigate('/reports');
  };

  const stats = [
    {
      title: "Contratos Gerados",
      value: "1,234",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Usuários Ativos",
      value: "89",
      change: "+5%",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Taxa de Conversão",
      value: "94.2%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Valor Total",
      value: "R$ 127.000",
      change: "+8%",
      icon: DollarSign,
      color: "text-orange-600"
    }
  ];

  const recentContracts = [
    {
      id: '1',
      contractorName: 'Hospital São Lucas',
      cityState: 'São Paulo, SP',
      signatureDate: '2024-01-15',
      status: 'approved',
      value: 'R$ 50.000,00'
    },
    {
      id: '2',
      contractorName: 'Clínica Médica Central',
      cityState: 'Rio de Janeiro, RJ',
      signatureDate: '2024-01-20',
      status: 'pending',
      value: 'R$ 35.000,00'
    },
    {
      id: '3',
      contractorName: 'Instituto de Saúde',
      cityState: 'Belo Horizonte, MG',
      signatureDate: '2024-01-25',
      status: 'rejected',
      value: 'R$ 42.000,00'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'pending':
        return 'Pendente';
      case 'rejected':
        return 'Rejeitado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Layout title="Dashboard" subtitle="Visão geral do sistema">
      <div className="space-y-4 sm:space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-green-600">
                        {stat.change}
                      </p>
                    </div>
                    <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Button 
                onClick={handleNewContract}
                className="flex items-center gap-2 text-sm sm:text-base"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                Novo Contrato
              </Button>
              <Button 
                onClick={handleViewCalendar}
                variant="outline" 
                className="flex items-center gap-2 text-sm sm:text-base"
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                Ver Calendário
              </Button>
              <Button 
                onClick={handleViewReports}
                variant="outline" 
                className="flex items-center gap-2 text-sm sm:text-base sm:col-span-2 lg:col-span-1"
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                Relatórios
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contratos Recentes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Contratos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {recentContracts.map((contract) => (
                <div key={contract.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg gap-2 sm:gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm sm:text-base">{contract.contractorName}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{contract.cityState}</p>
                    <p className="text-xs text-muted-foreground">
                      Assinado em: {new Date(contract.signatureDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Badge className={`text-xs ${getStatusColor(contract.status)}`}>
                      {getStatusText(contract.status)}
                    </Badge>
                    <span className="text-xs sm:text-sm font-medium">{contract.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard; 