import {createRequire} from 'node:module'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {toUrl} from 'url-or-path'
import createImport from './create-import.js'
import {createReadJson, createReadJsonSync} from './create-read-json.js'
import createResolve from './create-resolve.js'

const toDescriptor = (getter) => {
  let value
  return {
    get() {
       
      if (!value) {
        value = getter()
      }
      return value
    },
    enumerable: true,
  }
}

const createObject = (properties) => Object.create(null, properties)
const normalizeSourceModule = (sourceModule) => {
  const url = sourceModule.url || toUrl(sourceModule)
  const {resolve} = sourceModule
  return {url, resolve}
}

function createEsmUtilities(sourceModule) {
  const {url, resolve} = normalizeSourceModule(sourceModule)

  const utilities = createObject({
    // Path
    filename: toDescriptor(() => fileURLToPath(url)),
    dirname: toDescriptor(() => path.dirname(utilities.filename)),

    // Module
    require: toDescriptor(() => createRequire(url)),
    importModule: toDescriptor(() => createImport(url)),

    // Resolve
    resolve: toDescriptor(() => resolve || createResolve(url)),

    // JSON
    readJson: toDescriptor(() => createReadJson(url)),
    readJsonSync: toDescriptor(() => createReadJsonSync(url)),

    // Aliases
    __filename: toDescriptor(() => utilities.filename),
    __dirname: toDescriptor(() => utilities.dirname),
    import: toDescriptor(() => utilities.importModule),
    loadJson: toDescriptor(() => utilities.readJson),
    loadJsonSync: toDescriptor(() => utilities.readJsonSync),
  })

  return utilities
}

export default createEsmUtilities
