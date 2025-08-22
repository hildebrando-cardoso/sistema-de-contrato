// src/lib/usersApi.ts
import { supabase } from './supabaseClient'

export type UserRole = 'admin' | 'user' | 'super_admin'

export interface SearchUsersParams {
  q?: string | null
  role?: string | null
  status?: boolean | null
  limit?: number
  offset?: number
}

export interface UserRow {
  user_id: string
  name: string
  email: string
  role: string
  is_super_admin: boolean
  last_activity: string | null
  created_at: string
  company_id: string | null
  contratos: number
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  role?: UserRole
  company_id?: string | null
}

export interface UpdateUserData {
  name?: string
  role?: UserRole
  is_super_admin?: boolean
  company_id?: string | null
}

export async function searchUsers(params: SearchUsersParams = {}): Promise<UserRow[]> {
  const { q = null, role = null, status = null, limit = 20, offset = 0 } = params
  const { data, error } = await supabase.rpc('search_users', {
    _q: q,
    _role: role,
    _status: status,
    _limit: limit,
    _offset: offset
  })
  if (error) throw error
  return data as UserRow[]
}

export async function createUser(userData: CreateUserData): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    // Verificar se o usuário atual é admin
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
    if (userError || !currentUser) {
      throw new Error('Usuário não autenticado')
    }

    // Verificar permissões do usuário atual
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_super_admin')
      .eq('user_id', currentUser.id)
      .single()

    if (profileError || (!currentProfile.is_super_admin && currentProfile.role !== 'admin')) {
      throw new Error('Permissão negada: apenas administradores podem criar usuários')
    }

    // Criar usuário no Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      user_metadata: {
        name: userData.name
      },
      email_confirm: true // Confirmar email automaticamente para usuários criados por admin
    })

    if (error) throw error

    if (!data.user) {
      throw new Error('Erro ao criar usuário')
    }

    // Criar perfil do usuário
    const { error: profileCreateError } = await supabase
      .from('profiles')
      .insert([{
        user_id: data.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user',
        is_super_admin: false,
        company_id: userData.company_id,
        last_activity: new Date().toISOString()
      }])

    if (profileCreateError) {
      // Se falhar ao criar perfil, tentar remover o usuário criado
      await supabase.auth.admin.deleteUser(data.user.id)
      throw profileCreateError
    }

    // Log da atividade
    await supabase
      .from('activity_logs')
      .insert([{
        user_id: currentUser.id,
        action: 'create_user',
        resource_type: 'user',
        resource_id: data.user.id,
        details: {
          created_user_email: userData.email,
          created_user_name: userData.name,
          created_user_role: userData.role || 'user'
        }
      }])

    return { success: true, userId: data.user.id }
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error)
    return { success: false, error: error.message || 'Erro desconhecido' }
  }
}

export async function updateUser(userId: string, userData: UpdateUserData): Promise<{ success: boolean; error?: string }> {
  try {
    // Verificar se o usuário atual é admin
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
    if (userError || !currentUser) {
      throw new Error('Usuário não autenticado')
    }

    // Verificar permissões do usuário atual
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_super_admin')
      .eq('user_id', currentUser.id)
      .single()

    if (profileError || (!currentProfile.is_super_admin && currentProfile.role !== 'admin')) {
      throw new Error('Permissão negada: apenas administradores podem atualizar usuários')
    }

    // Atualizar perfil do usuário
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        ...userData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (updateError) throw updateError

    // Log da atividade
    await supabase
      .from('activity_logs')
      .insert([{
        user_id: currentUser.id,
        action: 'update_user',
        resource_type: 'user',
        resource_id: userId,
        details: {
          updated_fields: Object.keys(userData),
          changes: userData
        }
      }])

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error)
    return { success: false, error: error.message || 'Erro desconhecido' }
  }
}

export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Verificar se o usuário atual é admin
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
    if (userError || !currentUser) {
      throw new Error('Usuário não autenticado')
    }

    // Verificar permissões do usuário atual
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_super_admin')
      .eq('user_id', currentUser.id)
      .single()

    if (profileError || (!currentProfile.is_super_admin && currentProfile.role !== 'admin')) {
      throw new Error('Permissão negada: apenas administradores podem excluir usuários')
    }

    // Não permitir que o usuário exclua a si mesmo
    if (currentUser.id === userId) {
      throw new Error('Você não pode excluir sua própria conta')
    }

    // Obter informações do usuário antes de excluir
    const { data: userToDelete, error: getUserError } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('user_id', userId)
      .single()

    if (getUserError) throw getUserError

    // Excluir usuário do Supabase Auth (isso também remove o perfil devido ao CASCADE)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)

    if (deleteError) throw deleteError

    // Log da atividade
    await supabase
      .from('activity_logs')
      .insert([{
        user_id: currentUser.id,
        action: 'delete_user',
        resource_type: 'user',
        resource_id: userId,
        details: {
          deleted_user_name: userToDelete.name,
          deleted_user_email: userToDelete.email
        }
      }])

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao excluir usuário:', error)
    return { success: false, error: error.message || 'Erro desconhecido' }
  }
}

export async function resetUserPassword(userId: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Verificar se o usuário atual é admin
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
    if (userError || !currentUser) {
      throw new Error('Usuário não autenticado')
    }

    // Verificar permissões do usuário atual
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_super_admin')
      .eq('user_id', currentUser.id)
      .single()

    if (profileError || (!currentProfile.is_super_admin && currentProfile.role !== 'admin')) {
      throw new Error('Permissão negada: apenas administradores podem resetar senhas')
    }

    // Resetar senha do usuário
    const { error: resetError } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword
    })

    if (resetError) throw resetError

    // Log da atividade
    await supabase
      .from('activity_logs')
      .insert([{
        user_id: currentUser.id,
        action: 'reset_password',
        resource_type: 'user',
        resource_id: userId,
        details: {
          action_description: 'Password reset by admin'
        }
      }])

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao resetar senha:', error)
    return { success: false, error: error.message || 'Erro desconhecido' }
  }
}

