import {pathToFileURL} from 'node:url'
import {isUrl} from 'url-or-path'

function getModuleSource(source, base) {
  if (isUrl(source)) {
    return source
  }

  if (typeof source === 'string' && /^[a-z]:/i.test(source)) {
    return pathToFileURL(source)
  }

  if (source.startsWith('.')) {
    return new URL(source, base)
  }

  return source
}

const createImport = (base) => (source) => import(getModuleSource(source, base))

export default createImport
