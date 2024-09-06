import { z } from 'zod'
import { Board } from './board.dto'
import { Hand } from './hand.dto'
import { Metadata } from './metadata.dto'
import { Square } from './square.dto'

export const Record = z
  .object({
    metadata: z.array(Metadata),
    pieces: z.array(Square).min(39).max(40),
    hands: z.array(Hand),
    board: Board
  })
  .transform((object) => {
    return {
      ...object,
      get csa(): string {
        const text: string = [
          object.metadata.map((metadata) => metadata.csa).join('\n'),
          object.board.csa,
          object.hands.map((hand) => hand.csa).join('\n'),
          '+'
        ].join('\n')
        return text
      }
    }
  })
