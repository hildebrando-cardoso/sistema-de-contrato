// src/lib/reportsApi.ts
import { supabase } from './supabaseClient'

export interface MonthlyRevenueRow {
  month: string  // 'YYYY-MM-01'
  revenue: number
}

export async function getMonthlyRevenue(year: number): Promise<MonthlyRevenueRow[]> {
  try {
    const { data, error } = await supabase.rpc('report_monthly_revenue', { _year: year })
    if (error) throw error
    return data as MonthlyRevenueRow[]
  } catch (error) {
    console.warn('Supabase não configurado, retornando dados mockados:', error)
    // Retorna dados mockados para demonstração
    return Array.from({ length: 12 }, (_, i) => ({
      month: `${year}-${String(i + 1).padStart(2, '0')}-01`,
      revenue: Math.floor(Math.random() * 50000) + 10000
    }))
  }
}

export interface ContractStatusRow {
  status_enum: string
  total: number
}

export async function getContractStatus(year: number): Promise<ContractStatusRow[]> {
  try {
    const { data, error } = await supabase.rpc('report_contract_status', { _year: year })
    if (error) throw error
    return data as ContractStatusRow[]
  } catch (error) {
    console.warn('Supabase não configurado, retornando dados mockados:', error)
    // Retorna dados mockados para demonstração
    return [
      { status_enum: 'approved', total: 45 },
      { status_enum: 'pending', total: 12 },
      { status_enum: 'rejected', total: 3 }
    ]
  }
}

export interface ContractsByStateRow {
  estado: string
  contratos: number
  receita: number
}

export async function getContractsByState(year: number): Promise<ContractsByStateRow[]> {
  try {
    const { data, error } = await supabase.rpc('report_contracts_by_state', { _year: year })
    if (error) throw error
    return data as ContractsByStateRow[]
  } catch (error) {
    console.warn('Supabase não configurado, retornando dados mockados:', error)
    // Retorna dados mockados para demonstração
    const estados = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE']
    return estados.map(estado => ({
      estado,
      contratos: Math.floor(Math.random() * 20) + 1,
      receita: Math.floor(Math.random() * 100000) + 20000
    }))
  }
}
