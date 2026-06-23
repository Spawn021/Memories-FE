import { z } from 'zod'
import { PASSWORD_REGEXP } from '~/constants'
export const loginSchema = z.object({
  email: z.string().min(1, 'V6').email('V0'),
  password: z.string().min(8, 'V1').regex(PASSWORD_REGEXP, 'V2'),
  rememberMe: z.boolean().optional(),
})
