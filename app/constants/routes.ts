export const ROUTES = {
  // Guest routes
  HOME: '/',

  // Authentication routes (guests only)
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Public routes (guests and logged-in users)
  STORIES: '/stories',
  CURATION: '/curation',
  ABOUT: '/about',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  PROFILE: '/profile',

  // Authenticated routes
  SETTINGS: '/settings',
  SPACES: '/spaces',
  SPACE_DETAIL: '/spaces/[slug]',
} as const

export const guestRoutes: string[] = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD]
export const publicRoutes: string[] = [
  ROUTES.HOME,
  ROUTES.TERMS,
  ROUTES.PRIVACY,
  ROUTES.STORIES,
  ROUTES.CURATION,
  ROUTES.ABOUT,
  ROUTES.PROFILE,
]
export const noAuthRoutes: string[] = [...guestRoutes, ...publicRoutes]
