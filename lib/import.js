import path from 'node:path'
import {pathToFileURL} from 'node:url'

function createImport(base) {
  return function importPathOrUrl(file) {
    const url =
      typeof file === 'string' && path.isAbsolute(file)
        ? pathToFileURL(file)
        : new URL(file, base)

    return import(url)
  }
}

export default createImport
