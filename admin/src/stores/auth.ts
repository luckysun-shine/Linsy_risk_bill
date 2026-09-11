import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi } from '@/api/campaign'

const TOKEN_KEY = 'linsy_admin_token'
const USER_KEY = 'linsy_admin_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const username = ref(localStorage.getItem(USER_KEY) || '')

  async function login(user: string, password: string) {
    const data = await loginApi(user, password)
    token.value = data.token
    username.value = data.user.username
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, data.user.username)
  }

  function logout() {
    token.value = ''
    username.value = ''
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return { token, username, login, logout }
})
