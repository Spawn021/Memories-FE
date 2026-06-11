import { z } from 'zod'
export const registerSchema = z
  .object({
    email: z.string().min(1, 'V6').email('V0'),
    password: z
      .string()
      .min(8, 'V1')
      .regex(
        /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'V2',
      ),
    confirmPassword: z.string().min(1, 'V9'),
    terms: z.boolean().refine(val => val === true, 'V4'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'V3',
    path: ['confirmPassword'],
  })
