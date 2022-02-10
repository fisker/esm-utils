import {pathToFileURL} from 'node:url'

function createImport(base) {
  return function (file) {
    const url =
      typeof file === 'string' && /^[a-z]:/i.test(file)
        ? pathToFileURL(file)
        : new URL(file, base)

    return import(url)
  }
}

export default createImport
