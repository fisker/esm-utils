import importModule from './import-module.js'

function createImport(base) {
  return (source, options) => {
    if (typeof source === 'string' && source.startsWith('.')) {
      source = new URL(source, base)
    }

    return importModule(source, options)
  }
}

export default createImport
