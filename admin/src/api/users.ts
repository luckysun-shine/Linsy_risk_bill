import api from './client'

export interface AdminUser {
  id: string
  username: string
  email: string | null
  role: 'admin' | 'api_client'
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function fetchUsers() {
  const { data } = await api.get('/admin/users')
  return data.data as AdminUser[]
}

export async function createUser(payload: {
  username: string
  password: string
  email?: string | null
  role?: 'admin' | 'api_client'
}) {
  const { data } = await api.post('/admin/users', payload)
  return data.data as AdminUser
}

export async function updateUser(
  id: string,
  payload: {
    email?: string | null
    role?: 'admin' | 'api_client'
    is_active?: boolean
  }
) {
  const { data } = await api.put(`/admin/users/${id}`, payload)
  return data.data as AdminUser
}

export async function resetUserPassword(id: string, password: string) {
  const { data } = await api.put(`/admin/users/${id}/password`, { password })
  return data.data as { ok: boolean }
}

export async function deleteUser(id: string) {
  const { data } = await api.delete(`/admin/users/${id}`)
  return data.data as { ok: boolean }
}

export async function changeOwnPassword(current_password: string, new_password: string) {
  const { data } = await api.put('/auth/password', {
    current_password,
    new_password,
  })
  return data.data as { ok: boolean }
}
