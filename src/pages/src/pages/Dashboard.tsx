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

/** Supabase / RPCs */
import { supabase } from "@/lib/supabaseClient";
import { searchContracts } from "@/lib/contractsApi";
import { getMonthlyRevenue, getContractStatus } from "@/lib/reportsApi";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const navigate = useNavigate();
  
  console.log('Dashboard renderizado');

  const handleNewContract = () => {
    console.log('Botão Novo Contrato clicado');
    console.log('Navegando para /contract');
    navigate('/contract');
  };

  const handleViewCalendar = () => {
    navigate('/contracts');
  };

  const handleViewReports = () => {
    navigate('/reports');
  };

  /** helper local */
  const formatBRL = (n?: number | null) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
      .format(typeof n === 'number' ? n : 0);

  /** === DADOS DINÂMICOS ===
   * Mantemos a mesma estrutura de `stats` (title/value/change/icon/color)
   * e `recentContracts` para a UI continuar idêntica.
   */
  const [stats, setStats] = useState([
    { title: "Contratos Gerados", value: "—", change: "", icon: FileText,  color: "text-blue-600"  },
    { title: "Usuários Ativos",   value: "—", change: "", icon: Users,     color: "text-green-600" },
    { title: "Taxa de Conversão", value: "—", change: "", icon: TrendingUp, color: "text-purple-600" },
    { title: "Valor Total",       value: "—", change: "", icon: DollarSign, color: "text-orange-600" }
  ]);

  type RecentItem = {
    id: string;
    contractorName: string;
    cityState: string;
    signatureDate: string;
    status: string;
    value: string;
  };

  const [recentContracts, setRecentContracts] = useState<RecentItem[]>([]);

  /** carrega dados ao montar */
  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const year = new Date().getFullYear();

        // Relatórios: status (contagens) e receita mensal
        const [statusArr, monthly] = await Promise.all([
          getContractStatus(year),
          getMonthlyRevenue(year),
        ]);

        const totalContratos = statusArr.reduce((a, s) => a + Number(s.total || 0), 0);
        const aprovados = Number(statusArr.find(s => s.status_enum === 'approved')?.total || 0);
        const pendentes = Number(statusArr.find(s => s.status_enum === 'pending')?.total || 0);
        const rejeitados = Number(statusArr.find(s => s.status_enum === 'rejected')?.total || 0);
        const denom = aprovados + pendentes + rejeitados;
        const taxaConversao = denom ? `${(Math.round((aprovados / denom) * 1000) / 10).toFixed(1)}%` : '0%';

        const valorTotal = monthly.reduce((acc, r) => acc + Number(r.revenue || 0), 0);

        // Usuários ativos nos últimos 30 dias
        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const { count: activeUsers, error: eActive } = await supabase
          .from('profiles')
          .select('user_id', { count: 'exact', head: true })
          .gte('last_activity', since);
        if (eActive) throw eActive;

        // Atualiza cards mantendo estrutura
        if (alive) {
          setStats([
            { title: "Contratos Gerados", value: totalContratos.toLocaleString('pt-BR'), change: "", icon: FileText,  color: "text-blue-600"  },
            { title: "Usuários Ativos",   value: (activeUsers ?? 0).toLocaleString('pt-BR'), change: "", icon: Users,     color: "text-green-600" },
            { title: "Taxa de Conversão", value: taxaConversao, change: "", icon: TrendingUp, color: "text-purple-600" },
            { title: "Valor Total",       value: formatBRL(valorTotal), change: "", icon: DollarSign, color: "text-orange-600" }
          ]);
        }

        // Contratos recentes (3 itens, mesma estrutura da UI)
        const recents = await searchContracts({ limit: 3, offset: 0 });
        if (alive) {
          setRecentContracts(
            recents.map(r => ({
              id: r.id,
              contractorName: r.title ?? '—',
              cityState: [r.city, r.state].filter(Boolean).join(', ') || '—',
              signatureDate: r.signature_date ?? new Date().toISOString(),
              status: String(r.status_enum),
              value: formatBRL(Number(r.total_contract_value || 0))
            }))
          );
        }
      } catch (err) {
        console.error('[Dashboard] erro ao carregar dados:', err);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  /** ====== CORES/RÓTULOS DE STATUS (PT-BR) ====== */
  const STATUS_MAP: Record<
    string,
    { label: string; className: string }
  > = {
    approved: { label: 'Aprovado',  className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 border border-emerald-200/70 dark:border-emerald-800' },
    pending:  { label: 'Pendente',  className: 'bg-amber-100   text-amber-800   dark:bg-amber-900/30   dark:text-amber-200   border border-amber-200/70   dark:border-amber-800' },
    rejected: { label: 'Rejeitado', className: 'bg-rose-100    text-rose-800    dark:bg-rose-900/30    dark:text-rose-200    border border-rose-200/70    dark:border-rose-800' },
    draft:    { label: 'Rascunho',  className: 'bg-slate-100   text-slate-700   dark:bg-slate-900/30   dark:text-slate-200   border border-slate-200/70   dark:border-slate-800' },
    canceled: { label: 'Cancelado', className: 'bg-zinc-100    text-zinc-800    dark:bg-zinc-900/30    dark:text-zinc-200    border border-zinc-200/70    dark:border-zinc-800' },
    expired:  { label: 'Expirado',  className: 'bg-orange-100  text-orange-800  dark:bg-orange-900/30  dark:text-orange-200  border border-orange-200/70  dark:border-orange-800' },
    default:  { label: 'Desconhecido', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200 border border-gray-200/70 dark:border-gray-800' }
  };

  // Mantém nomes originais usados na sua página:
  const getStatusColor = (status: string) =>
    (STATUS_MAP[status]?.className ?? STATUS_MAP.default.className);

  const getStatusText = (status: string) =>
    (STATUS_MAP[status]?.label ?? STATUS_MAP.default.label);

  return (
    <Layout title="Dashboard" subtitle="Visão geral do sistema">
      <div className="space-y-4 sm:space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon as any;
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
                onClick={() => {
                  console.log('Botão clicado diretamente');
                  handleNewContract();
                }}
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
