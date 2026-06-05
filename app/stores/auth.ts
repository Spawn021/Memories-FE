import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  uuid: string
  email: string
  globalRole: string
  displayName: string | null
  avatarUrl: string | null
  birthdate: string | null
  sessionId?: number
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref<boolean>(false)

  const isAuthenticated = computed(() => user.value !== null)

  function setUser(newUser: User | null) {
    user.value = newUser
  }

  function clearUser() {
    user.value = null
  }

  return {
    user,
    loading,
    isAuthenticated,
    setUser,
    clearUser,
  }
})
