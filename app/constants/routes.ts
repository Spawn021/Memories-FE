export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  TERMS: '/terms',
  PRIVACY: '/privacy',
  PROFILE: '/profile',

  DASHBOARD: '/dashboard',
} as const

export const guestRoutes: string[] = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD]
export const publicRoutes: string[] = [ROUTES.HOME, ROUTES.TERMS, ROUTES.PRIVACY]
export const noAuthRoutes: string[] = [...guestRoutes, ...publicRoutes]
