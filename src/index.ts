import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { type Record as TSRecord, importCSA } from 'tsshogi'
import type { z } from 'zod'
import { TCSA } from './format/tsca'
import type { Board } from './models/board.dto'
import type { Hand } from './models/hand.dto'
import type { Metadata } from './models/metadata.dto'
import type { Record } from './models/record.dto'
import type { Square } from './models/square.dto'

dayjs.extend(customParseFormat)

export namespace TCSV {
  export type Record = z.infer<typeof Record>
  export type Hand = z.infer<typeof Hand>
  export type Square = z.infer<typeof Square>
  export type Board = z.infer<typeof Board>
  export type Metadata = z.infer<typeof Metadata>
}

declare module '@/models/square.dto' {
  interface Square {
    readonly csa: string
  }
}

/**
 * 詰将棋パラダイスの棋譜データを読み込みます
 * @param query
 * @returns
 */
export const importTCSV = (query: string): TSRecord | Error => {
  return TCSA.parse(query).record
}
