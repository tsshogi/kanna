import { Color, PieceType, Square } from 'tsshogi'
import { z } from 'zod'

export const Move = z
  .object({
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
  .transform((object) => {
    return {
      ...object,
      get piece(): PieceType | Square {
        if (object.from.x === 0) {
          switch (object.from.y - 1) {
            case 0:
              return PieceType.PAWN
            case 1:
              return PieceType.LANCE
            case 2:
              return PieceType.KNIGHT
            case 3:
              return PieceType.SILVER
            case 4:
              return PieceType.GOLD
            case 5:
              return PieceType.ROOK
            case 6:
              return PieceType.BISHOP
            default:
              throw new Error(`Unexpected piece type: ${object.from.y}`)
          }
        }
        return new Square(object.from.x, object.from.y)
      }
    }
  })
