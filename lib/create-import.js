import isRelativePath from './is-relative-path.js'
import importModule from './import-module.js'

function createImport(base) {
  return (source, options) => {
    if (isRelativePath(source)) {
      source = new URL(source, base)
    }

    return importModule(source, options)
  }
}

export default createImport
