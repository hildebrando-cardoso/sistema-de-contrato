// src/lib/contractsApi.ts
import { supabase } from './supabaseClient'

export type ContractStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'canceled' | 'expired'

export interface SearchContractsParams {
  q?: string | null
  status?: ContractStatus | null
  limit?: number
  offset?: number
}

export interface ContractRow {
  id: string
  title: string | null
  city: string | null
  state: string | null
  signature_date: string | null
  status_enum: ContractStatus
  plan_contracted: string | null
  monthly_plan_value: number | null
  total_contract_value: number | null
}

export async function searchContracts(params: SearchContractsParams = {}): Promise<ContractRow[]> {
  const { q = null, status = null, limit = 20, offset = 0 } = params
  const { data, error } = await supabase.rpc('search_contracts', {
    _q: q,
    _status: status,
    _limit: limit,
    _offset: offset
  })
  if (error) throw error
  return data as ContractRow[]
}
