import { ROUTES } from '~/constants'

export const useRoutes = () => {
  const localePath = useLocalePath()

  const resolve = (path: string, query?: Record<string, string>) => {
    return localePath(query ? { path, query } : path)
  }

  return {
    home: (query?: Record<string, string>) => resolve(ROUTES.HOME, query),
    login: (query?: Record<string, string>) => resolve(ROUTES.LOGIN, query),
    profile: (query?: Record<string, string>) => resolve(ROUTES.PROFILE, query),
    dashboard: (query?: Record<string, string>) => resolve(ROUTES.DASHBOARD, query),
    register: (query?: Record<string, string>) => resolve(ROUTES.REGISTER, query),
    forgotPassword: (query?: Record<string, string>) => resolve(ROUTES.FORGOT_PASSWORD, query),
    terms: (query?: Record<string, string>) => resolve(ROUTES.TERMS, query),
    privacy: (query?: Record<string, string>) => resolve(ROUTES.PRIVACY, query),
  }
}
