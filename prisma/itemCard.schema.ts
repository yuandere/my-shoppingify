import { z } from 'zod';

export const itemCardAdd = z.object({
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  imageUrl: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
})

export const itemCardDelete = z.string().cuid();