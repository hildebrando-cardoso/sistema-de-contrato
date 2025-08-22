// src/lib/contractsApi.ts
import { supabase } from './supabaseClient'

export type ContractStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'canceled' | 'expired'
export type ContractPlan = 'cuidar-educar-especialidades' | 'cuidar-educar-exclusivo' | 'cuidar-educar-padrao'
export type PaymentMethod = 'boleto' | 'cartao' | 'pix' | 'transferencia'

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

export interface ContractorData {
  contractorName: string
  contractorCNPJ: string
  contractorAddress: string
  legalRepresentative: string
  representativeCPF: string
}

export interface EquipmentData {
  equipment43: string
  equipment55: string
  players: string
}

export interface ContractFormData {
  contractors: ContractorData[]
  cityState: string
  signatureDate: string
  contractedPlan: string
  implementationValue: string
  monthlyValue: string
  paymentMethod: string
  dueDate: string
  contractTerm: string
  equipment43: string
  equipment55: string
  players: string
}

export interface CreateContractData {
  title?: string
  city: string
  state: string
  signature_date: string
  status_enum: ContractStatus
  plan_contracted: ContractPlan
  implementation_value: number
  monthly_plan_value: number
  total_contract_value: number
  payment_method: PaymentMethod
  due_date: string
  contract_term: number
  generated_contract_text?: string
  contractors: ContractorData[]
  equipment: {
    equipment43: number
    equipment55: number
    players: number
  }
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

export async function createContract(contractData: CreateContractData): Promise<{ success: boolean; contractId?: string; error?: string }> {
  try {
    // Obter usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('Usuário não autenticado')
    }

    // Criar o contrato principal
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .insert([{
        title: contractData.title || `Contrato ${contractData.contractors[0]?.contractorName || 'Sem nome'}`,
        city: contractData.city,
        state: contractData.state,
        signature_date: contractData.signature_date,
        status_enum: contractData.status_enum,
        plan_contracted: contractData.plan_contracted,
        implementation_value: contractData.implementation_value,
        monthly_plan_value: contractData.monthly_plan_value,
        total_contract_value: contractData.total_contract_value,
        payment_method: contractData.payment_method,
        due_date: contractData.due_date,
        contract_term: contractData.contract_term,
        generated_contract_text: contractData.generated_contract_text,
        user_id: user.id
      }])
      .select()
      .single()

    if (contractError) throw contractError

    const contractId = contract.id

    // Inserir contratantes
    if (contractData.contractors.length > 0) {
      const contractorsToInsert = contractData.contractors.map((contractor, index) => ({
        contract_id: contractId,
        contractor_name: contractor.contractorName,
        contractor_cnpj: contractor.contractorCNPJ,
        contractor_address: contractor.contractorAddress,
        legal_representative: contractor.legalRepresentative,
        representative_cpf: contractor.representativeCPF,
        order_index: index
      }))

      const { error: contractorsError } = await supabase
        .from('contractors')
        .insert(contractorsToInsert)

      if (contractorsError) throw contractorsError
    }

    // Inserir equipamentos
    const equipmentTypes = await getEquipmentTypes()
    const equipmentToInsert = []

    if (contractData.equipment.equipment43 > 0) {
      const type43 = equipmentTypes.find(t => t.name === 'TV 43"')
      if (type43) {
        equipmentToInsert.push({
          contract_id: contractId,
          equipment_type_id: type43.id,
          quantity: contractData.equipment.equipment43,
          unit_value: contractData.implementation_value / (contractData.equipment.equipment43 + contractData.equipment.equipment55 + contractData.equipment.players),
          total_value: (contractData.implementation_value / (contractData.equipment.equipment43 + contractData.equipment.equipment55 + contractData.equipment.players)) * contractData.equipment.equipment43
        })
      }
    }

    if (contractData.equipment.equipment55 > 0) {
      const type55 = equipmentTypes.find(t => t.name === 'TV 55"')
      if (type55) {
        equipmentToInsert.push({
          contract_id: contractId,
          equipment_type_id: type55.id,
          quantity: contractData.equipment.equipment55,
          unit_value: contractData.implementation_value / (contractData.equipment.equipment43 + contractData.equipment.equipment55 + contractData.equipment.players),
          total_value: (contractData.implementation_value / (contractData.equipment.equipment43 + contractData.equipment.equipment55 + contractData.equipment.players)) * contractData.equipment.equipment55
        })
      }
    }

    if (contractData.equipment.players > 0) {
      const typePlayers = equipmentTypes.find(t => t.name === 'Player')
      if (typePlayers) {
        equipmentToInsert.push({
          contract_id: contractId,
          equipment_type_id: typePlayers.id,
          quantity: contractData.equipment.players,
          unit_value: contractData.implementation_value / (contractData.equipment.equipment43 + contractData.equipment.equipment55 + contractData.equipment.players),
          total_value: (contractData.implementation_value / (contractData.equipment.equipment43 + contractData.equipment.equipment55 + contractData.equipment.players)) * contractData.equipment.players
        })
      }
    }

    if (equipmentToInsert.length > 0) {
      const { error: equipmentError } = await supabase
        .from('contract_equipment')
        .insert(equipmentToInsert)

      if (equipmentError) throw equipmentError
    }

    // Log da atividade
    await supabase
      .from('activity_logs')
      .insert([{
        user_id: user.id,
        action: 'create_contract',
        resource_type: 'contract',
        resource_id: contractId,
        details: {
          contract_title: contract.title,
          total_value: contractData.total_contract_value
        }
      }])

    return { success: true, contractId }
  } catch (error: any) {
    console.error('Erro ao criar contrato:', error)
    return { success: false, error: error.message || 'Erro desconhecido' }
  }
}

async function getEquipmentTypes() {
  const { data, error } = await supabase
    .from('equipment_types')
    .select('*')
    .eq('is_active', true)

  if (error) throw error
  return data || []
}

export function parseContractFormData(formData: ContractFormData): CreateContractData {
  // Separar cidade e estado
  const [city, state] = formData.cityState.split(',').map(s => s.trim())
  
  // Converter valores monetários
  const parseCurrency = (value: string): number => {
    const numbers = value.replace(/\D/g, '')
    return numbers === '' ? 0 : parseInt(numbers, 10) / 100
  }

  const implementationValue = parseCurrency(formData.implementationValue)
  const monthlyValue = parseCurrency(formData.monthlyValue)

  return {
    city: city || formData.cityState,
    state: state || '',
    signature_date: formData.signatureDate,
    status_enum: 'pending',
    plan_contracted: formData.contractedPlan as ContractPlan,
    implementation_value: implementationValue,
    monthly_plan_value: monthlyValue,
    total_contract_value: implementationValue + monthlyValue,
    payment_method: formData.paymentMethod as PaymentMethod,
    due_date: formData.dueDate,
    contract_term: parseInt(formData.contractTerm) || 12,
    contractors: formData.contractors,
    equipment: {
      equipment43: parseInt(formData.equipment43) || 0,
      equipment55: parseInt(formData.equipment55) || 0,
      players: parseInt(formData.players) || 0
    }
  }
}
