// From https://github.com/sindresorhus/type-fest
type JsonValue =
  | string
  | number
  | boolean
  | null
  | {[Key in string]?: JsonValue}
  | JsonValue[]

/**
Read and parse a JSON file.

@example
```
import createEsmUtils from 'esm-utils'
const {readJson} = createEsmUtils(import.meta)

const data = await readJson('./foo.json')
```
*/
export type readJson = (file: string | URL) => Promise<JsonValue>

/**
Read and parse a JSON file.

@example
```
import createEsmUtils from 'esm-utils'
const {readJsonSync} = createEsmUtils(import.meta)

const data = json.loadSync('foo.json')
```
*/
export type readJsonSync = (file: string | URL) => JsonValue

export interface JsonUtils {
  read: readJson
  load: readJson
  readSync: readJsonSync
  loadSync: readJsonSync
}

/**
Import a file

@param file string | URL

@example
```
import createEsmUtils from 'esm-utils'
const {importFile} = createEsmUtils(import.meta)

const foo = await importFile('./foo.js')
```
*/
export type importFile = (file: string | URL) => Promise<unknown>

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
  readonly importFile: importFile
  readonly readJson: readJson
  readonly readJsonSync: readJsonSync

  // Alias
  readonly __filename: string
  readonly __dirname: string
  readonly import: importFile
  readonly loadJson: readJson
  readonly loadJsonSync: readJsonSync
  readonly json: JsonUtils
}
