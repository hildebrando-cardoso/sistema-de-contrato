// src/pages/Reports.tsx
import React from 'react'
import { getMonthlyRevenue, getContractStatus, getContractsByState } from '../lib/reportsApi'

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
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Relatórios Gerenciais</h1>
        <select value={year} onChange={e => setYear(Number(e.target.value))} className="border rounded-lg px-3 py-2">
          {Array.from({ length: 6 }).map((_, i) => {
            const y = currentYear - i
            return <option key={y} value={y}>{y}</option>
          })}
        </select>
      </div>

      {loading && <div className="p-6 border rounded-xl mb-4">Carregando…</div>}
      {error && <div className="p-6 border rounded-xl mb-4 text-red-600">{error}</div>}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-gray-500">Receita Total</div>
          <div className="text-2xl font-semibold mt-1">{formatBRL(totalYear)}</div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-gray-500">Aprovados</div>
          <div className="text-2xl font-semibold mt-1">
            {status.find(s => s.status_enum === 'approved')?.total ?? 0}
          </div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-gray-500">Pendentes</div>
          <div className="text-2xl font-semibold mt-1">
            {status.find(s => s.status_enum === 'pending')?.total ?? 0}
          </div>
        </div>
      </div>

      {/* Receita Mensal */}
      <div className="border rounded-xl p-4 mb-6">
        <h2 className="font-medium mb-3">Receita Mensal</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {monthly.map(m => (
            <div key={m.month} className="border rounded-lg p-3">
              <div className="text-xs text-gray-500">{new Date(m.month).toLocaleDateString('pt-BR', { month: 'short' })}</div>
              <div className="font-medium">{formatBRL(Number(m.revenue))}</div>
            </div>
          ))}
          {monthly.length === 0 && <div className="text-sm text-gray-500">Sem dados para {year}.</div>}
        </div>
      </div>

      {/* Status dos Contratos */}
      <div className="border rounded-xl p-4 mb-6">
        <h2 className="font-medium mb-3">Status dos Contratos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {status.map(s => (
            <div key={s.status_enum} className="border rounded-lg p-3">
              <div className="text-xs text-gray-500">{s.status_enum}</div>
              <div className="font-medium">{s.total}</div>
            </div>
          ))}
          {status.length === 0 && <div className="text-sm text-gray-500">Sem dados para {year}.</div>}
        </div>
      </div>

      {/* Detalhamento por Estado */}
      <div className="border rounded-xl p-4 mb-6">
        <h2 className="font-medium mb-3">Dados por Estado</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2">Estado</th>
                <th className="text-right px-3 py-2">Contratos</th>
                <th className="text-right px-3 py-2">Receita</th>
              </tr>
            </thead>
            <tbody>
              {byState.map(r => (
                <tr key={r.estado} className="border-t">
                  <td className="px-3 py-2">{r.estado}</td>
                  <td className="px-3 py-2 text-right">{r.contratos}</td>
                  <td className="px-3 py-2 text-right">{formatBRL(Number(r.receita))}</td>
                </tr>
              ))}
              {byState.length === 0 && (
                <tr><td colSpan={3} className="px-3 py-4 text-center text-gray-500">Sem dados para {year}.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
