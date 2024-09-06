import { z } from 'zod'
import { TCSV } from '../'
import { Square } from './square.dto'

const Line = z.array(Square.nullable()).length(9)

export const Board = z
  .object({
    pieces: z.array(Line).length(9)
  })
  .transform((object) => {
    return {
      ...object,
      get csa(): string {
        return object.pieces
          .map((line, index) => `P${index + 1}${line.map((piece) => piece?.csa || ' * ').join('')}`)
          .join('\n')
      }
    }
  })
