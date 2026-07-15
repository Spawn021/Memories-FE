import { authRepository } from './auth.repository'
import { useAuthStore } from '~/stores/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export const useAuth = () => {
  const authRepo = authRepository()
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  const useLogin = () => {
    return useMutation({
      mutationFn: authRepo.login,
      onSuccess: user => authStore.setUser(user),
    })
  }

  const useRegister = () => {
    return useMutation({
      mutationFn: ({ email, password }: { email: string; password: string }) => authRepo.register(email, password),
    })
  }

  const useVerifyEmail = () => {
    return useMutation({
      mutationFn: ({ email, otp }: { email: string; otp: string }) => authRepo.verifyEmail(email, otp),
    })
  }

  const useResendVerification = () => {
    return useMutation({
      mutationFn: authRepo.resendVerification,
    })
  }

  const useForgotPassword = () => {
    return useMutation({
      mutationFn: authRepo.forgotPassword,
    })
  }

  const useVerifyResetOtp = () => {
    return useMutation({
      mutationFn: ({ email, otp }: { email: string; otp: string }) => authRepo.verifyResetOtp(email, otp),
    })
  }

  const useResetPassword = () => {
    return useMutation({
      mutationFn: ({ newPassword }: { newPassword: string }) => authRepo.resetPassword(newPassword),
    })
  }

  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: ({ displayName, username }: { displayName: string; username: string }) => authRepo.updateMe(displayName, username),
      onSuccess: user => authStore.setUser(user),
    })
  }

  const useLogout = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: () => authRepo.logout(),
      onSuccess: () => {
        queryClient.clear()
        authStore.clearUser()
      },
    })
  }

  // initAuth is a one-time boot call — no cache needed
  const initAuth = async () => {
    try {
      const user = await authRepo.getMe()
      if (user) {
        authStore.setUser(user)
      } else {
        authStore.clearUser()
      }
    } catch {
      authStore.clearUser()
    }
  }

  const loginWithGoogle = (redirectPath?: string) => {
    if (typeof window !== 'undefined') {
      if (redirectPath) {
        localStorage.setItem('auth_redirect', redirectPath)
      } else {
        localStorage.removeItem('auth_redirect')
      }
    }
    window.location.href = `${config.public.apiBase}/auth/google`
  }

  return {
    useLogin,
    useRegister,
    useVerifyEmail,
    useResendVerification,
    useForgotPassword,
    useVerifyResetOtp,
    useResetPassword,
    useUpdateProfile,
    useLogout,
    initAuth,
    loginWithGoogle,
  }
}
