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
Import a file module

@param file string | URL

@example
```
import createEsmUtils from 'esm-utils'
const {importFile} = createEsmUtils(import.meta)

const foo = await importFile('./foo.js')
```
*/
type importFile = (file: string | URL) => Promise<unknown>

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
  readonly importFile: importFile
  readonly __filename: string
  readonly __dirname: string
  readonly import: importFile
}
