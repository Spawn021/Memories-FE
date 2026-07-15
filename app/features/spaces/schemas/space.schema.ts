import { z } from 'zod'

export const spaceSchema = z.object({
  name: z.string().trim().min(1, 'V10'),
  description: z.string().max(500, 'V11').optional().or(z.literal('')),
  type: z.enum(['PERSONAL', 'COUPLE', 'FRIENDS', 'FAMILY'], {
    error: 'V12',
  }),
  visibility: z.enum(['PUBLIC', 'PRIVATE'], {
    error: 'V13',
  }),
  coverUrl: z.string().optional().or(z.literal('')),
  avatarUrl: z.string().optional().or(z.literal('')),
})

export type SpaceForm = z.infer<typeof spaceSchema>
