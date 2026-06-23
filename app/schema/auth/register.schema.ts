import { z } from 'zod'
import { PASSWORD_REGEXP } from '~/constants'
export const registerSchema = z
  .object({
    email: z.string().min(1, 'V6').email('V0'),
    password: z.string().min(8, 'V1').regex(PASSWORD_REGEXP, 'V2'),
    confirmPassword: z.string().min(1, 'V9'),
    terms: z.boolean().refine(val => val === true, 'V4'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'V3',
    path: ['confirmPassword'],
  })
