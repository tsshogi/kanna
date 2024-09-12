import { Square } from '@/models/square.dto'
import { z } from 'zod'

export const Answer = z.array(z.array(Square)).transform((object) => {
  return {
    ...object,
    get csa(): string {
      return object[0].map((move) => move.csa).join('\n')
    }
  }
})
