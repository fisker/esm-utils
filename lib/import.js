import path from 'node:path'
import {toUrl} from 'url-or-path'

function createImport(directory) {
  return function importPathOrUrl(urlOrPath) {
    if (
      typeof urlOrPath === 'string' &&
      !urlOrPath.startsWith('file:') &&
      !path.isAbsolute(urlOrPath)
    ) {
      urlOrPath = path.join(directory, urlOrPath)
    }

    return import(toUrl(urlOrPath))
  }
}

export default createImport
