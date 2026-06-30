import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRepository } from '~/repositories'
import { useRuntimeConfig } from '#app'

export const useAuth = () => {
  const authStore = useAuthStore()
  const { auth: authRepo } = useRepository()
  const config = useRuntimeConfig()

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    authStore.loading = true
    try {
      const user = await authRepo.login(email, password, rememberMe)
      authStore.setUser(user)
      return user
    } finally {
      authStore.loading = false
    }
  }

  const register = async (email: string, password: string) => {
    authStore.loading = true
    try {
      const response = await authRepo.register('', email, '', password)
      return response
    } finally {
      authStore.loading = false
    }
  }

  const verifyEmail = async (email: string, otp: string) => {
    authStore.loading = true
    try {
      const response = await authRepo.verifyEmail(email, otp)
      return response
    } finally {
      authStore.loading = false
    }
  }

  const resendVerificationCode = async (email: string) => {
    authStore.loading = true
    try {
      const response = await authRepo.resendVerification(email)
      return response
    } finally {
      authStore.loading = false
    }
  }

  const forgotPassword = async (email: string) => {
    authStore.loading = true
    try {
      return await authRepo.forgotPassword(email)
    } finally {
      authStore.loading = false
    }
  }

  const verifyResetOtp = async (email: string, otp: string) => {
    authStore.loading = true
    try {
      return await authRepo.verifyResetOtp(email, otp)
    } finally {
      authStore.loading = false
    }
  }

  const resetPassword = async (newPassword: string) => {
    authStore.loading = true
    try {
      return await authRepo.resetPassword(newPassword)
    } finally {
      authStore.loading = false
    }
  }

  const updateProfile = async (displayName: string, username: string) => {
    authStore.loading = true
    try {
      const updatedUser = await authRepo.updateMe(displayName, username)
      authStore.setUser(updatedUser)
      return updatedUser
    } finally {
      authStore.loading = false
    }
  }

  const logout = async () => {
    authStore.loading = true
    try {
      await authRepo.logout()
    } finally {
      authStore.clearUser()
      authStore.loading = false
    }
  }

  const initAuth = async () => {
    authStore.loading = true
    try {
      const user = await authRepo.getMe()
      authStore.setUser(user)
    } catch {
      authStore.clearUser()
    } finally {
      authStore.loading = false
    }
  }

  const loginWithGoogle = () => {
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
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
    updateProfile,
    logout,
    initAuth,
    loginWithGoogle,
  }
}
