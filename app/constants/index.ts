export * from './routes'

export const TIME_RESEND_OTP = 60
export const ERROR_STATUS_CODE = {
  CONNECTION_ERROR: 0,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
}

export const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
