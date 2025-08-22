// src/lib/reportsApi.ts
import { supabase } from './supabaseClient'

export interface MonthlyRevenueRow {
  month: string  // 'YYYY-MM-01'
  revenue: number
}

export async function getMonthlyRevenue(year: number): Promise<MonthlyRevenueRow[]> {
  const { data, error } = await supabase.rpc('report_monthly_revenue', { _year: year })
  if (error) throw error
  return data as MonthlyRevenueRow[]
}

export interface ContractStatusRow {
  status_enum: string
  total: number
}

export async function getContractStatus(year: number): Promise<ContractStatusRow[]> {
  const { data, error } = await supabase.rpc('report_contract_status', { _year: year })
  if (error) throw error
  return data as ContractStatusRow[]
}

export interface ContractsByStateRow {
  estado: string
  contratos: number
  receita: number
}

export async function getContractsByState(year: number): Promise<ContractsByStateRow[]> {
  const { data, error } = await supabase.rpc('report_contracts_by_state', { _year: year })
  if (error) throw error
  return data as ContractsByStateRow[]
}
