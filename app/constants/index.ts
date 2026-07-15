export * from './routes'

export const TIME_RESEND_OTP = 60
export const ERROR_STATUS_CODE = {
  CONNECTION_ERROR: 0,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
}

export const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
export const DEFAULT_PAGE_TABLE = 1
export const DEFAULT_LIMIT_TABLE = 10
export const DEFAULT_PAGE_OPTIONS = [5, 10, 15, 20]
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const
