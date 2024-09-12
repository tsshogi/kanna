import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { text } from 'node:stream/consumers'
import { it } from 'node:test'
import { type Record, exportCSA, exportKIF } from 'tsshogi'
import { importTCSV } from '..'

describe('math', () => {
  test('parse', () => {
    for (const index of Array.from({ length: 100 }, (_, i) => i)) {
      if (index === 95 || index === 65) continue
      const query = readFileSync(`src/tests/csv/${index}.txt`, { encoding: 'utf8' })
      const record: Record | Error = importTCSV(query)
      if (record instanceof Error) {
        throw record
      }
    }
  })
})
