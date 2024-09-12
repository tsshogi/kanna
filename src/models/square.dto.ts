import { Color } from '@/enums/color'
import { Piece } from '@/enums/piece'
import { z } from 'zod'

/**
 * 駒
 */
export const Square = z.preprocess(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (input: any) => {
    const { value, index } = input
    // if (value instanceof Square) return input
    if (value === undefined && index === undefined) return input
    const [x, y, color, is_promoted] = (value as string).split('').map((value: string) => Number.parseInt(value))
    return {
      piece: (() => {
        if (index < 18) return Piece.FU
        if (index < 22) return Piece.KY
        if (index < 26) return Piece.KE
        if (index < 30) return Piece.GI
        if (index < 34) return Piece.KI
        if (index < 36) return Piece.HI
        if (index < 38) return Piece.KA
        return Piece.OU
      })(),
      color: color === 0 ? Color.BLACK : Color.WHITE,
      // x === 0 || y === 0 のときに強制的に持ち駒に変換する
      x: y === 0 ? 0 : x,
      y: x === 0 ? 0 : y,
      is_promoted: is_promoted === 2
    }
  },
  z
    .object({
      piece: z.nativeEnum(Piece),
      color: z.nativeEnum(Color),
      x: z.number(),
      y: z.number(),
      is_promoted: z.boolean()
    })
    .transform((object) => {
      return {
        ...object,
        get csa(): string {
          const piece: Piece = !object.is_promoted
            ? object.piece
            : (() => {
                switch (object.piece) {
                  case Piece.FU:
                    return Piece.TO
                  case Piece.KY:
                    return Piece.NY
                  case Piece.KE:
                    return Piece.NK
                  case Piece.GI:
                    return Piece.NG
                  case Piece.KA:
                    return Piece.UM
                  case Piece.HI:
                    return Piece.RY
                  default:
                    return object.piece
                }
              })()
          return `${object.color === Color.BLACK ? '+' : '-'}${piece}`
        }
      }
    })
)
