import { Color } from '@/enums/color'
import { MetadataKey } from '@/enums/metadata'
import { Board } from '@/models/board.dto'
import { Hand } from '@/models/hand.dto'
import { Metadata } from '@/models/metadata.dto'
import { Record } from '@/models/record.dto'
import { Square } from '@/models/square.dto'
import dayjs from 'dayjs'
import { type Record as TSRecord, importCSA } from 'tsshogi'
import { z } from 'zod'
import type { TCSV } from '..'

/**
 * 詰将棋パラダイス用のフォーマット
 */
export const TCSA = z.preprocess(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (query: any) => {
    return Object.fromEntries(
      new Map(
        decodeURIComponent(query as string)
          .split('&')
          .map((query) => query.split('='))
          .map(([key, value]) => [key, value])
      )
    )
  },
  z
    .object({
      d: z.string().pipe(z.coerce.number()),
      workid: z.string().pipe(z.coerce.number()),
      csv: z.string(),
      hint: z.string(),
      answercsv: z.string(),
      title: z.string(),
      authorname: z.string(),
      progresscnt: z.string().pipe(z.coerce.number()),
      workupdate: z.string().transform((date) => dayjs(date, 'YYYY/MM/DD[HH:mm:ss]').toDate()),
      point: z.string().pipe(z.coerce.number()),
      level: z.string().pipe(z.coerce.number())
    })
    .transform((object) => {
      return {
        ...object,
        get pieces(): TCSV.Square[] {
          const pieces = object.csv.split('_').filter((value) => value.length > 0)
          return pieces.map((value, index) => Square.parse({ value: value, index: index }))
        },
        square(x: number, y: number): TCSV.Square | null {
          return (this as TCSA).pieces.find((square) => square.x === x && square.y === y) || null
        },
        get hands(): TCSV.Hand[] {
          return [Color.BLACK, Color.WHITE].map((color) =>
            Hand.parse({
              color: color,
              pieces: (this as TCSA).pieces.filter(
                (square) => square.color === color && square.x === 0 && square.y === 0
              )
            })
          )
        },
        get board(): TCSV.Board {
          return Board.parse({
            pieces: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((y) =>
              [9, 8, 7, 6, 5, 4, 3, 2, 1].map((x) => (this as TCSA).square(x, y))
            )
          })
        },
        get metadata(): TCSV.Metadata[] {
          return [
            { key: MetadataKey.TITLE, value: object.title },
            { key: MetadataKey.AUTHOR, value: object.authorname },
            { key: MetadataKey.PUBLISHED_BY, value: '詰将棋パラダイス' },
            { key: MetadataKey.PUBLISHED_AT, value: dayjs(object.workupdate).format('YYYY/MM/DD') },
            { key: MetadataKey.LEVEL, value: object.level },
            { key: MetadataKey.POINT, value: object.point },
            { key: MetadataKey.HINT, value: object.hint },
            { key: MetadataKey.LENGTH, value: object.progresscnt },
            { key: MetadataKey.OPUS_NAME, value: '詰将棋パラダイス' },
            { key: MetadataKey.OPUS_NO, value: object.workid }
          ].map((metadata) => Metadata.parse(metadata))
        },
        get record(): TSRecord | Error {
          return importCSA(
            Record.parse({
              metadata: (this as TCSA).metadata,
              pieces: (this as TCSA).pieces,
              hands: (this as TCSA).hands,
              board: (this as TCSA).board
            }).csa
          )
        }
      }
    })
)

export type TCSA = z.infer<typeof TCSA>
