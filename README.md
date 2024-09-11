## Shogi Kif Parser

独自形式で配布されている棋譜データをtsshogiのRecord型に変換するためのライブラリです.

### 対応データ

- [x] 詰将棋パラダイス

### 使い方

```ts
import { importTCSV } from '@tsshogi/kanna'
import { Record } from 'tsshogi'

const text: string = "" // 詰将棋パラダイスのテキストデータ
const record: Record | Error = importTCSV(text)
if (record instanceof Error) return
exportKIF(record) // KIF形式の文字列
```

### 参考

- [tsshogi](https://github.com/sunfish-shogi/tsshogi)

### ライセンス

[MIT License](https://github.com/tsshogi/kanna/blob/main/LICENSE)
