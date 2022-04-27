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

export interface ImportModuleOptions {
  readonly traceSyntaxError?: boolean
}

/**
Import a module

@param source string | URL
@param options ImportModuleOptions

@example
```
import createEsmUtils from 'esm-utils'
const {importModule} = createEsmUtils(import.meta)

const foo = await importModule('./foo.js')
```
*/
export type importModule = (
  file: string | URL,
  options?: ImportModuleOptions,
) => Promise<unknown>

/**
Create utilities for ES Module.

@param sourceModule - `import.meta`, `URL`, or path to the source module

@example
```
import createEsmUtils from 'esm-utils'

const esmUtils = createEsmUtils(import.meta)
```
*/
export default function createEsmUtils(
  sourceModule: ImportMeta | URL | string,
): {
  readonly filename: string
  readonly dirname: string
  readonly require: NodeRequire
  readonly importModule: importModule
  readonly readJson: readJson
  readonly readJsonSync: readJsonSync

  // Alias
  readonly __filename: string
  readonly __dirname: string
  readonly import: importModule
  readonly loadJson: readJson
  readonly loadJsonSync: readJsonSync
}
