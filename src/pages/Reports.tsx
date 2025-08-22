// src/pages/Reports.tsx
import React from 'react'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getMonthlyRevenue, getContractStatus, getContractsByState } from '../lib/reportsApi'
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Calendar,
  BarChart3,
  MapPin
} from 'lucide-react'

function formatBRL(n?: number | null) {
  const v = typeof n === 'number' ? n : 0
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

export default function Reports() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = React.useState(currentYear)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [monthly, setMonthly] = React.useState<Awaited<ReturnType<typeof getMonthlyRevenue>>>([])
  const [status, setStatus] = React.useState<Awaited<ReturnType<typeof getContractStatus>>>([])
  const [byState, setByState] = React.useState<Awaited<ReturnType<typeof getContractsByState>>>([])

  const totalYear = React.useMemo(
    () => monthly.reduce((acc, r) => acc + (Number(r.revenue) || 0), 0),
    [monthly]
  )

  React.useEffect(() => {
    let active = true
    async function run() {
      setLoading(true); setError(null)
      try {
        const [m, s, b] = await Promise.all([
          getMonthlyRevenue(year),
          getContractStatus(year),
          getContractsByState(year),
        ])
        if (!active) return
        setMonthly(m); setStatus(s); setByState(b)
      } catch (err: any) {
        if (active) setError(err?.message ?? 'Erro ao carregar relatórios')
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => { active = false }
  }, [year])

  return (
    <Layout title="Relatórios Gerenciais" subtitle="Análise detalhada do desempenho do sistema">
      <div className="space-y-4 sm:space-y-6">
        {/* Header com seletor de ano */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Dados do ano:</span>
          </div>
          <select 
            value={year} 
            onChange={e => setYear(Number(e.target.value))} 
            className="border border-input rounded-lg px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {Array.from({ length: 6 }).map((_, i) => {
              const y = currentYear - i
              return <option key={y} value={y}>{y}</option>
            })}
          </select>
        </div>

        {loading && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-sm text-muted-foreground">Carregando dados...</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center text-red-600">
                <FileText className="h-5 w-5 mr-2" />
                {error}
              </div>
            </CardContent>
          </Card>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Receita Total
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold mt-1">
                    {formatBRL(totalYear)}
                  </p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Aprovados
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold mt-1">
                    {status.find(s => s.status_enum === 'approved')?.total ?? 0}
                  </p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Pendentes
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold mt-1">
                    {status.find(s => s.status_enum === 'pending')?.total ?? 0}
                  </p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Receita Mensal */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              Receita Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {monthly.map(m => (
                <Card key={m.month} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      {new Date(m.month).toLocaleDateString('pt-BR', { month: 'short' })}
                    </div>
                    <div className="font-medium text-sm">
                      {formatBRL(Number(m.revenue))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {monthly.length === 0 && (
                <div className="col-span-full text-center py-4">
                  <p className="text-sm text-muted-foreground">Sem dados para {year}.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status dos Contratos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              Status dos Contratos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {status.map(s => {
                const getStatusBadge = (statusEnum: string) => {
                  switch (statusEnum) {
                    case 'approved':
                      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    case 'pending':
                      return 'bg-amber-100 text-amber-800 border-amber-200'
                    case 'rejected':
                      return 'bg-rose-100 text-rose-800 border-rose-200'
                    default:
                      return 'bg-gray-100 text-gray-800 border-gray-200'
                  }
                }
                
                const getStatusLabel = (statusEnum: string) => {
                  switch (statusEnum) {
                    case 'approved': return 'Aprovados'
                    case 'pending': return 'Pendentes'
                    case 'rejected': return 'Rejeitados'
                    default: return statusEnum
                  }
                }
                
                return (
                  <Card key={s.status_enum} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`text-xs border ${getStatusBadge(s.status_enum)}`}>
                          {getStatusLabel(s.status_enum)}
                        </Badge>
                      </div>
                      <div className="font-bold text-lg">{s.total}</div>
                    </CardContent>
                  </Card>
                )
              })}
              {status.length === 0 && (
                <div className="col-span-full text-center py-4">
                  <p className="text-sm text-muted-foreground">Sem dados para {year}.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detalhamento por Estado */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              Dados por Estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-3 py-3 font-medium text-muted-foreground">Estado</th>
                    <th className="text-right px-3 py-3 font-medium text-muted-foreground">Contratos</th>
                    <th className="text-right px-3 py-3 font-medium text-muted-foreground">Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {byState.map(r => (
                    <tr key={r.estado} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-3 py-3 font-medium">{r.estado}</td>
                      <td className="px-3 py-3 text-right">{r.contratos}</td>
                      <td className="px-3 py-3 text-right font-medium">{formatBRL(Number(r.receita))}</td>
                    </tr>
                  ))}
                  {byState.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-3 py-8 text-center text-muted-foreground">
                        Sem dados para {year}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
