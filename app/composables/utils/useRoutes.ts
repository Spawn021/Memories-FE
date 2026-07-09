/* eslint-disable @typescript-eslint/no-explicit-any */
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
    register: (query?: Record<string, any>) => resolve(ROUTES.REGISTER, query),
    forgotPassword: (query?: Record<string, any>) => resolve(ROUTES.FORGOT_PASSWORD, query),
    terms: (query?: Record<string, any>) => resolve(ROUTES.TERMS, query),
    privacy: (query?: Record<string, any>) => resolve(ROUTES.PRIVACY, query),
    stories: (query?: Record<string, any>) => resolve(ROUTES.STORIES, query),
    curation: (query?: Record<string, any>) => resolve(ROUTES.CURATION, query),
    about: (query?: Record<string, any>) => resolve(ROUTES.ABOUT, query),
    spaces: (query?: Record<string, any>) => resolve(ROUTES.SPACES, query),
    settings: (query?: Record<string, any>) => resolve(ROUTES.SETTINGS, query),
    spaceDetail: (slug: string, query?: Record<string, any>) => resolve(ROUTES.SPACE_DETAIL.replace('[slug]', slug), query),
  }
}
