import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { type Record, exportCSA } from 'tsshogi'
import { importTCSV } from '..'

describe('math', () => {
  test('parse', () => {
    for (const index of [100, 1000]) {
      const query = readFileSync(`src/tests/csv/${index}.txt`, { encoding: 'utf8' })
      const object: Record | Error = importTCSV(query)
      if (object instanceof Error) {
        throw object
      }
    }
  })
})
