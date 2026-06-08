import { z } from 'zod'

export const productFilterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
})

export type ProductFilterData = z.infer<typeof productFilterSchema>
