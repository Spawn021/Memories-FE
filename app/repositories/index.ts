import { useApi } from '~/composables/useApi'
import { createAuthRepository } from './auth.repository'

export const useRepository = () => {
  const api = useApi()

  return {
    auth: createAuthRepository(api),
  }
}
