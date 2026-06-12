import { ROUTES } from '~/constants'

export const useRoutes = () => {
  const localePath = useLocalePath()

  const resolve = (path: string, query?: Record<string, any>) => {
    return localePath(query ? { path, query } : path)
  }

  return {
    home: (query?: Record<string, any>) => resolve(ROUTES.HOME, query),
    login: (query?: Record<string, any>) => resolve(ROUTES.LOGIN, query),
    profile: (query?: Record<string, any>) => resolve(ROUTES.PROFILE, query),
    dashboard: (query?: Record<string, any>) => resolve(ROUTES.DASHBOARD, query),
    register: (query?: Record<string, any>) => resolve(ROUTES.REGISTER, query),
    forgotPassword: (query?: Record<string, any>) => resolve(ROUTES.FORGOT_PASSWORD, query),
    terms: (query?: Record<string, any>) => resolve(ROUTES.TERMS, query),
    privacy: (query?: Record<string, any>) => resolve(ROUTES.PRIVACY, query),
  }
}
