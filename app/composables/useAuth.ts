import { computed } from 'vue'
import { useAuthStore, type User } from '../stores/auth'
import { useApi } from './useApi'
import { useRuntimeConfig } from '#app'

export const useAuth = () => {
  const authStore = useAuthStore()
  const api = useApi()
  const config = useRuntimeConfig()

  const login = async (email: string, password: string) => {
    authStore.loading = true
    try {
      const response = await api<{ success: boolean; data: User }>('/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      if (response.success && response.data) {
        authStore.setUser(response.data)
      }
      return response
    } finally {
      authStore.loading = false
    }
  }

  const register = async (
    displayName: string,
    email: string,
    username: string,
    password: string,
  ) => {
    authStore.loading = true
    try {
      const response = await api<{ success: boolean; data: any }>('/auth/register', {
        method: 'POST',
        body: { displayName, email, username, password },
      })
      return response
    } finally {
      authStore.loading = false
    }
  }

  const logout = async () => {
    authStore.loading = true
    try {
      await api('/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      authStore.clearUser()
      authStore.loading = false
    }
  }

  const initAuth = async () => {
    authStore.loading = true
    try {
      const response = await api<{ success: boolean; data: User }>('/users/me')
      if (response.success && response.data) {
        authStore.setUser(response.data)
      } else {
        authStore.clearUser()
      }
    } catch (error) {
      authStore.clearUser()
    } finally {
      authStore.loading = false
    }
  }

  const loginWithGoogle = () => {
    // Redirect browser directly to backend google initiation endpoint
    const apiBase = config.public.apiBase
    const googleLoginUrl = `${apiBase}/auth/google`
    window.location.href = googleLoginUrl
  }

  return {
    user: computed(() => authStore.user),
    loading: computed(() => authStore.loading),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    login,
    register,
    logout,
    initAuth,
    loginWithGoogle,
  }
}
