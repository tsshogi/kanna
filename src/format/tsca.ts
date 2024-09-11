import { Color } from '@/enums/color'
import { MetadataKey } from '@/enums/metadata'
import { Board } from '@/models/board.dto'
import { Hand } from '@/models/hand.dto'
import { Metadata } from '@/models/metadata.dto'
import { Move } from '@/models/move.dto'
import { Record } from '@/models/record.dto'
import { Square } from '@/models/square.dto'
import dayjs from 'dayjs'
import {
  PieceType,
  SpecialMoveType,
  type Move as TSMove,
  Node as TSNode,
  type Record as TSRecord,
  Square as TSSquare,
  exportCSA,
  exportKIF,
  importCSA
} from 'tsshogi'
import { z } from 'zod'
import type { TCSV } from '..'

const chunk = <T>(arr: T[], size: number): T[][] => {
  const results: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    results.push(arr.slice(i, i + size))
  }
  return results
}

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
        get answer(): TCSV.Move[][] {
          return chunk(
            object.answercsv
              .split('_')
              .filter((value) => value.length > 0)
              .map((value, index) => {
                const [fromX, fromY, toX, toY, promote] = value.split('').map((value) => Number.parseInt(value))
                return Move.parse({
                  from: { x: fromX, y: fromY },
                  to: { x: toX, y: toY },
                  promote: promote === 1
                })
              }),
            object.progresscnt
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
          const record: TSRecord | Error = importCSA(
            Record.parse({
              metadata: (this as TCSA).metadata,
              pieces: (this as TCSA).pieces,
              hands: (this as TCSA).hands,
              board: (this as TCSA).board
            }).csa
          )
          if (record instanceof Error) {
            return record
          }
          for (const moves of (this as TCSA).answer) {
            // 初期局面に戻す
            record.goto(0)
            for (const move of moves) {
              const m: TSMove | null = record.position.createMove(
                move.from.x === 0 ? Object.values(PieceType)[move.from.y - 1] : new TSSquare(move.from.x, move.from.y),
                new TSSquare(move.to.x, move.to.y)
              )
              // 不正な指し手でなければ追加する
              if (m !== null) {
                m.promote = move.promote
                record.append(m)
              }
            }
            // 投了コマンドの追加
            record.append(SpecialMoveType.RESIGN)
          }
          return record
        }
      }
    })
)

export type TCSA = z.infer<typeof TCSA>
