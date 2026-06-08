import type { User } from '~/types'

export const createAuthRepository = (api: ReturnType<typeof $fetch.create>) => ({
  async login(email: string, password: string): Promise<User> {
    return api<User>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
  },

  async register(
    displayName: string,
    email: string,
    username: string,
    password: string,
  ): Promise<void> {
    return api('/auth/register', {
      method: 'POST',
      body: { displayName, email, username, password },
    })
  },

  async logout(): Promise<void> {
    await api('/auth/logout', {
      method: 'POST',
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
})
