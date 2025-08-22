// src/pages/ContractsPage.tsx
import React, { useEffect, useMemo, useState } from 'react'
import { searchContracts } from '../lib/contractsApi'

type ContractStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'canceled' | 'expired'
type Row = Awaited<ReturnType<typeof searchContracts>>[number]

function useDebounce<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

function formatBRL(n?: number | null) {
  const v = typeof n === 'number' ? n : 0
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

function StatusBadge({ status }: { status: ContractStatus }) {
  const map: Record<ContractStatus, string> = {
    approved: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    canceled: 'bg-zinc-100 text-zinc-800',
    expired: 'bg-orange-100 text-orange-800'
  }
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs ${map[status]}`}>
      {status}
    </span>
  )
}

export default function ContractsPage() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<ContractStatus | ''>('')
  const [page, setPage] = useState(0)
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const limit = 10
  const debouncedQ = useDebounce(q)

  const statusOptions: {label: string; value: ContractStatus | ''}[] = useMemo(
    () => [
      { label: 'Todos os status', value: '' },
      { label: 'Aprovado', value: 'approved' },
      { label: 'Pendente', value: 'pending' },
      { label: 'Rejeitado', value: 'rejected' },
      { label: 'Rascunho', value: 'draft' },
      { label: 'Cancelado', value: 'canceled' },
      { label: 'Expirado', value: 'expired' },
    ],
    []
  )

  useEffect(() => {
    let active = true
    async function run() {
      setLoading(true); setError(null)
      try {
        const data = await searchContracts({
          q: debouncedQ || null,
          status: (status || null) as any,
          limit,
          offset: page * limit,
        })
        if (active) setRows(data)
      } catch (err: any) {
        if (active) setError(err?.message ?? 'Erro ao carregar contratos')
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => { active = false }
  }, [debouncedQ, status, page])

  function next() { setPage(p => p + 1) }
  function prev() { setPage(p => Math.max(0, p - 1)) }
  function onSearchChange(v: string) { setPage(0); setQ(v) }
  function onStatusChange(v: string) { setPage(0); setStatus(v as any) }

  // exportação CSV simples
  function exportCSV() {
    const headers = ['id','title','city','state','signature_date','status','monthly_plan_value','total_contract_value']
    const lines = rows.map(r => [r.id, r.title ?? '', r.city ?? '', r.state ?? '', r.signature_date ?? '', r.status_enum, r.monthly_plan_value ?? 0, r.total_contract_value ?? 0].join(','))
    const csv = [headers.join(','), ...lines].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contratos.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Gerenciar Contratos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <input
          value={q}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Buscar por título, cidade ou estado..."
          className="border rounded-lg px-3 py-2"
        />
        <select
          value={status}
          onChange={e => onStatusChange(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          {statusOptions.map(opt => (
            <option key={opt.label} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => { setQ(''); setStatus(''); setPage(0) }}
            className="border rounded-lg px-3 py-2"
            title="Limpar filtros"
          >
            Limpar
          </button>
          <button onClick={exportCSV} className="border rounded-lg px-3 py-2">Exportar CSV</button>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Título</th>
              <th className="text-left px-4 py-3">Local</th>
              <th className="text-left px-4 py-3">Assinatura</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Plano Mensal</th>
              <th className="text-right px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-4 py-6 text-center">Carregando…</td></tr>
            )}
            {error && !loading && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-red-600">{error}</td></tr>
            )}
            {!loading && !error && rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center">Nenhum contrato encontrado.</td></tr>
            )}
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3">{r.title ?? '—'}</td>
                <td className="px-4 py-3">{[r.city, r.state].filter(Boolean).join(', ') || '—'}</td>
                <td className="px-4 py-3">{r.signature_date ?? '—'}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status_enum as ContractStatus} /></td>
                <td className="px-4 py-3 text-right">{formatBRL(r.monthly_plan_value)}</td>
                <td className="px-4 py-3 text-right font-medium">{formatBRL(r.total_contract_value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button onClick={prev} disabled={page === 0} className="border rounded-lg px-3 py-2 disabled:opacity-50">Anterior</button>
        <span className="text-sm">Página {page + 1}</span>
        <button onClick={next} disabled={rows.length < limit} className="border rounded-lg px-3 py-2 disabled:opacity-50">Próxima</button>
      </div>
    </div>
  )
}
