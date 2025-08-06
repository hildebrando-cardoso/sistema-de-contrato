import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/Layout";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign, 
  MapPin, 
  Calendar,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";

// Mock data para os gráficos
const mockData = {
  usersByRegion: [
    { region: "Sudeste", users: 45, contracts: 120 },
    { region: "Nordeste", users: 28, contracts: 85 },
    { region: "Sul", users: 32, contracts: 95 },
    { region: "Centro-Oeste", users: 15, contracts: 42 },
    { region: "Norte", users: 12, contracts: 38 }
  ],
  contractsByPlan: [
    { plan: "Especialidades", count: 180, percentage: 60 },
    { plan: "Exclusivo", count: 120, percentage: 40 }
  ],
  contractsByStatus: [
    { status: "Aprovado", count: 200, color: "#10b981" },
    { status: "Pendente", count: 80, color: "#f59e0b" },
    { status: "Rejeitado", count: 20, color: "#ef4444" }
  ],
  monthlyRevenue: [
    { month: "Jan", revenue: 45000 },
    { month: "Fev", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Abr", revenue: 61000 },
    { month: "Mai", revenue: 55000 },
    { month: "Jun", revenue: 67000 },
    { month: "Jul", revenue: 59000 },
    { month: "Ago", revenue: 72000 },
    { month: "Set", revenue: 68000 },
    { month: "Out", revenue: 75000 },
    { month: "Nov", revenue: 82000 },
    { month: "Dez", revenue: 89000 }
  ],
  topUsers: [
    { name: "Maria Santos", contracts: 25, revenue: 125000 },
    { name: "Pedro Oliveira", contracts: 18, revenue: 90000 },
    { name: "Ana Costa", contracts: 15, revenue: 75000 },
    { name: "João Silva", contracts: 12, revenue: 60000 },
    { name: "Lucia Ferreira", contracts: 10, revenue: 50000 }
  ],
  contractsByState: [
    { state: "SP", contracts: 85, value: 425000 },
    { state: "RJ", contracts: 45, value: 225000 },
    { state: "MG", contracts: 38, value: 190000 },
    { state: "RS", contracts: 32, value: 160000 },
    { state: "PR", contracts: 28, value: 140000 },
    { state: "SC", contracts: 25, value: 125000 },
    { state: "BA", contracts: 22, value: 110000 },
    { state: "PE", contracts: 18, value: 90000 }
  ]
};

// Componente de gráfico de barras simples
const BarChart = ({ data, title, xKey, yKey, color = "#3b82f6" }: any) => {
  const maxValue = Math.max(...data.map((item: any) => item[yKey]));
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-2">
        {data.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-24 text-sm font-medium">{item[xKey]}</div>
            <div className="flex-1">
              <div className="relative h-8 bg-muted rounded dark:bg-muted/50">
                <div
                  className="h-8 rounded transition-all duration-500"
                  style={{
                    width: `${(item[yKey] / maxValue) * 100}%`,
                    backgroundColor: color
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                  {item[yKey]}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de gráfico de pizza simples
const PieChartComponent = ({ data, title }: any) => {
  const total = data.reduce((sum: number, item: any) => sum + item.count, 0);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            {data.map((item: any, index: number) => {
              const percentage = (item.count / total) * 100;
              const rotation = data
                .slice(0, index)
                .reduce((sum: number, prev: any) => sum + (prev.count / total) * 360, 0);
              
              return (
                <div
                  key={index}
                  className="absolute inset-0 rounded-full border-8 border-transparent"
                  style={{
                    background: `conic-gradient(${item.color} ${rotation}deg, ${item.color} ${rotation + percentage}deg, transparent ${rotation + percentage}deg)`
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          {data.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm">{item.status}</span>
              <span className="text-sm font-medium ml-auto">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente de gráfico de linha simples
const LineChart = ({ data, title, xKey, yKey, color = "#10b981" }: any) => {
  const maxValue = Math.max(...data.map((item: any) => item[yKey]));
  const minValue = Math.min(...data.map((item: any) => item[yKey]));
  const range = maxValue - minValue;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="relative h-64 bg-muted/30 rounded-lg p-4 dark:bg-muted/20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={data.map((item: any, index: number) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((item[yKey] - minValue) / range) * 100;
              return `${x},${y}`;
            }).join(" ")}
          />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
          {data.map((item: any, index: number) => (
            <span key={index}>{item[xKey]}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [selectedReport, setSelectedReport] = useState("overview");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalRevenue = mockData.monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  const totalContracts = mockData.contractsByStatus.reduce((sum, item) => sum + item.count, 0);
  const totalUsers = mockData.usersByRegion.reduce((sum, item) => sum + item.users, 0);

  return (
    <Layout 
      title="Relatórios Gerenciais"
      subtitle="Análises e insights sobre o desempenho do sistema"
    >
      <div className="space-y-4 sm:space-y-6">

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32 sm:w-40 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger className="w-40 sm:w-48 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Visão Geral</SelectItem>
              <SelectItem value="financial">Financeiro</SelectItem>
              <SelectItem value="users">Usuários</SelectItem>
              <SelectItem value="contracts">Contratos</SelectItem>
              <SelectItem value="geographic">Geográfico</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <Button variant="outline" className="flex items-center gap-2 text-sm">
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Atualizar</span>
            <span className="sm:hidden">Atualizar</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2 text-sm">
            <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Filtros</span>
            <span className="sm:hidden">Filtros</span>
          </Button>
          <Button className="flex items-center gap-2 text-sm">
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Exportar</span>
            <span className="sm:hidden">Exportar</span>
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Card className="dark:bg-card dark:border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Receita Total</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-card dark:border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Contratos Gerados</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{totalContracts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-card dark:border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Usuários Ativos</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-card dark:border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Taxa de Conversão</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">94.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="geographic">Geográfico</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Receita Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={mockData.monthlyRevenue} 
                  title="Receita Mensal" 
                  xKey="month" 
                  yKey="revenue"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Status dos Contratos</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChartComponent 
                  data={mockData.contractsByStatus} 
                  title="Status dos Contratos"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Receita por Região</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={mockData.usersByRegion} 
                  title="Receita por Região" 
                  xKey="region" 
                  yKey="contracts"
                  color="#10b981"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Top Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockData.topUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.contracts} contratos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{formatCurrency(user.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Usuários por Região</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={mockData.usersByRegion} 
                  title="Usuários por Região" 
                  xKey="region" 
                  yKey="users"
                  color="#3b82f6"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Distribuição de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockData.usersByRegion.map((region, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{region.region}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(region.users / totalUsers) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{region.users}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Contratos por Plano</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChartComponent 
                  data={mockData.contractsByPlan} 
                  title="Contratos por Plano"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Contratos por Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={mockData.contractsByState} 
                  title="Contratos por Estado" 
                  xKey="state" 
                  yKey="contracts"
                  color="#8b5cf6"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Valor por Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={mockData.contractsByState} 
                  title="Valor por Estado" 
                  xKey="state" 
                  yKey="value"
                  color="#f59e0b"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Distribuição Geográfica</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockData.contractsByState.map((state, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{state.state}</p>
                        <p className="text-xs text-muted-foreground">{state.contracts} contratos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{formatCurrency(state.value)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Tabela de Dados Detalhados */}
      <Card className="mt-6 dark:bg-card dark:border-border">
        <CardHeader>
          <CardTitle>Dados Detalhados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-border">
                  <th className="text-left p-2">Estado</th>
                  <th className="text-left p-2">Usuários</th>
                  <th className="text-left p-2">Contratos</th>
                  <th className="text-left p-2">Receita</th>
                  <th className="text-left p-2">Plano Mais Popular</th>
                </tr>
              </thead>
              <tbody>
                {mockData.usersByRegion.map((item, index) => (
                  <tr key={index} className="border-b dark:border-border hover:bg-muted/50">
                    <td className="p-2">{item.region}</td>
                    <td className="p-2">{item.users}</td>
                    <td className="p-2">{item.contracts}</td>
                    <td className="p-2">{formatCurrency(item.contracts * 5000)}</td>
                    <td className="p-2">
                      {item.contracts > 50 ? "Especialidades" : "Exclusivo"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
    </Layout>
  );
}; 