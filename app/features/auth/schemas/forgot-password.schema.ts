import { z } from 'zod'
import { PASSWORD_REGEXP } from '~/constants'

export const emailSchema = z.object({
  email: z.string().min(1, 'V6').email('V0'),
})

export const newPasswordSchema = z
  .object({
    password: z.string().min(8, 'V1').regex(PASSWORD_REGEXP, 'V2'),
    confirmPassword: z.string().min(1, 'V9'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'V3',
    path: ['confirmPassword'],
  })
