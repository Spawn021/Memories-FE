import { authRepository } from './auth.repository'
import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authRepo = authRepository()
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  const useLogin = () => {
    const mutation = useMutation(authRepo.login)
    const execute = async (email: string, password: string, rememberMe?: boolean) => {
      await mutation.execute(email, password, rememberMe)
      if (!mutation.error.value && mutation.data.value) {
        authStore.setUser(mutation.data.value)
      }
    }
    return { ...mutation, execute }
  }

  const useRegister = () => {
    const mutation = useMutation(authRepo.register)
    const execute = async (email: string, password: string) => {
      await mutation.execute('', email, '', password)
    }
    return { ...mutation, execute }
  }

  const useVerifyEmail = () => {
    return useMutation(authRepo.verifyEmail)
  }

  const useResendVerification = () => {
    return useMutation(authRepo.resendVerification)
  }

  const useForgotPassword = () => {
    return useMutation(authRepo.forgotPassword)
  }

  const useVerifyResetOtp = () => {
    return useMutation(authRepo.verifyResetOtp)
  }

  const useResetPassword = () => {
    return useMutation(authRepo.resetPassword)
  }

  const useUpdateProfile = () => {
    const mutation = useMutation(authRepo.updateMe)
    const execute = async (displayName: string, username: string) => {
      await mutation.execute(displayName, username)
      if (!mutation.error.value && mutation.data.value) {
        authStore.setUser(mutation.data.value)
      }
    }
    return { ...mutation, execute }
  }

  const useLogout = () => {
    const mutation = useMutation(authRepo.logout)
    const execute = async () => {
      await mutation.execute()
      authStore.clearUser()
    }
    return { ...mutation, execute }
  }

  const useGetMe = () => {
    return useQuery('auth-me', authRepo.getMe, {
      immediate: false,
    })
  }

  const initAuth = async () => {
    const getMeQuery = useGetMe()
    try {
      await getMeQuery.refresh()
      if (getMeQuery.data.value) {
        authStore.setUser(getMeQuery.data.value)
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
    const apiBase = config.public.apiBase
    const googleLoginUrl = `${apiBase}/auth/google`
    window.location.href = googleLoginUrl
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
    useGetMe,
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    initAuth,
    loginWithGoogle,
  }
}
