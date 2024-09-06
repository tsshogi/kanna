import { Color } from '@/enums/color'
import { z } from 'zod'
import { Square } from './square.dto'

/**
 * 持ち駒
 */
export const Hand = z
  .object({
    color: z.nativeEnum(Color),
    pieces: z.array(Square)
  })
  .transform((object) => {
    return {
      ...object,
      get csa(): string {
        return `P${object.color === Color.BLACK ? '+' : '-'}${object.pieces.map((square) => `00${square.piece}`).join('')}`
      }
    }
  })
