export interface JSONLoader {
  load (file: string | URL): Promise<Record<string, any>>
  loadSync (file: string | URL): Record<string, any>
}

/**
Create a utilities you'll need when migrating to ESModule.

@param importMeta import.meta

@example
```
import createEsmUtils from 'esm-utils'

const esmUtils = createEsmUtils(import.meta)
```
 */
export default function createEsmUtils (
  importMeta: ImportMeta,
): {
  readonly filename: string
  readonly dirname: string
  readonly require: NodeRequire
  readonly json: JSONLoader
  readonly __filename: string
  readonly __dirname: string
}
