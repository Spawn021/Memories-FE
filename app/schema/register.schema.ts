import { z } from 'zod'
export const registerSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email address format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least one lowercase letter, one number, and one special character',
      ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    terms: z.boolean().refine(val => val === true, 'You must agree to the Terms & Privacy Policy'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
