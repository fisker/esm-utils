// From https://github.com/sindresorhus/type-fest
type JsonValue =
  | string
  | number
  | boolean
  | null
  | {[Key in string]?: JsonValue}
  | JsonValue[]

export interface JsonUtils {
  /**
  Read and parse a JSON file.

  @example
  ```
  import createEsmUtils from 'esm-utils'
  const {json} = createEsmUtils(import.meta)

  const data = await json.load('foo.json')
  ```
  */
  load(file: string | URL): Promise<JsonValue>
  /**
  Read and parse a JSON file.

  @example
  ```
  import createEsmUtils from 'esm-utils'
  const {json} = createEsmUtils(import.meta)

  const data = json.loadSync('foo.json')
  ```
  */
  loadSync(file: string | URL): JsonValue
}

/**
Create utilities for ES Module.

@param importMeta import.meta

@example
```
import createEsmUtils from 'esm-utils'

const esmUtils = createEsmUtils(import.meta)
```
*/
export default function createEsmUtils(importMeta: ImportMeta): {
  readonly filename: string
  readonly dirname: string
  readonly require: NodeRequire
  readonly json: JsonUtils
  readonly __filename: string
  readonly __dirname: string
}
