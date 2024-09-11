import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { type Record, exportCSA, exportKIF } from 'tsshogi'
import { importTCSV } from '..'

describe('math', () => {
  test('parse', () => {
    for (const index of [100, 1000]) {
      const query = readFileSync(`src/tests/csv/${index}.txt`, { encoding: 'utf8' })
      const record: Record | Error = importTCSV(query)
      if (record instanceof Error) {
        throw record
      }
      console.log(exportKIF(record))
    }
  })
})
