import type { ApiSuccessMessage } from '~/types'
import type { User } from './auth.type'
import type { LoginForm } from './schemas/login.schema'
import type { EmailForm } from './schemas/forgot-password.schema'

export const authRepository = () => {
  const api = useApi()
  return {
    async login(body: LoginForm): Promise<User> {
      return api<User>('/auth/login', {
        method: 'POST',
        body,
      })
    },

    async register(email: string, password: string): Promise<ApiSuccessMessage> {
      return api('/auth/register', {
        method: 'POST',
        body: { email, password },
      })
    },

    async verifyEmail(email: string, otp: string): Promise<ApiSuccessMessage> {
      return api('/auth/verify-email', {
        method: 'POST',
        body: { email, otp },
      })
    },

    async resendVerification(email: EmailForm): Promise<ApiSuccessMessage> {
      return api('/auth/resend-verification', {
        method: 'POST',
        body: { email },
      })
    },

    async logout(): Promise<void> {
      await api('/auth/logout', {
        method: 'POST',
      })
    },

    async forgotPassword(email: EmailForm): Promise<ApiSuccessMessage> {
      return api('/auth/forgot-password', {
        method: 'POST',
        body: { email },
      })
    },

    async verifyResetOtp(email: string, otp: string): Promise<ApiSuccessMessage> {
      return api('/auth/verify-reset-otp', {
        method: 'POST',
        body: { email, otp },
      })
    },

    async resetPassword(newPassword: string): Promise<ApiSuccessMessage> {
      return api('/auth/reset-password', {
        method: 'POST',
        body: { newPassword },
      })
    },

    async getMe(): Promise<User> {
      return api<User>('/users/me', {
        method: 'GET',
      })
    },

    async updateMe(displayName: string, username: string): Promise<User> {
      return api<User>('/users/me', {
        method: 'PATCH',
        body: { displayName, username },
      })
    },
  }
}
