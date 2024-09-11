import { Color } from 'tsshogi'
import { z } from 'zod'

export const Move = z.object({
  from: z.object({
    x: z.number().int().min(0).max(9),
    y: z.number().int().min(0).max(9)
  }),
  to: z.object({
    x: z.number().int().min(0).max(9),
    y: z.number().int().min(0).max(9)
  }),
  promote: z.boolean()
})
