import { MetadataKey } from '@/enums/metadata'
import { z } from 'zod'

/**
 * メタデータ
 */
export const Metadata = z
  .object({
    key: z.nativeEnum(MetadataKey),
    value: z.union([z.string(), z.number()])
  })
  .transform((object) => {
    return {
      ...object,
      get csa(): string {
        return `$${object.key}:${object.value}`
      }
    }
  })
