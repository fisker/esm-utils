import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {createRequire} from 'node:module'
import {toUrl} from 'url-or-path'
import {createReadJson, createReadJsonSync} from './create-read-json.js'
import createImport from './create-import.js'
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

function createEsmUtils(sourceModule) {
  const {url, resolve} = normalizeSourceModule(sourceModule)

  const utils = createObject({
    // Path
    filename: toDescriptor(() => fileURLToPath(url)),
    dirname: toDescriptor(() => path.dirname(utils.filename)),

    // Module
    require: toDescriptor(() => createRequire(url)),
    importModule: toDescriptor(() => createImport(url)),

    // Resolve
    resolve: toDescriptor(() => resolve || createResolve(url)),

    // JSON
    readJson: toDescriptor(() => createReadJson(url)),
    readJsonSync: toDescriptor(() => createReadJsonSync(url)),

    // Aliases
    __filename: toDescriptor(() => utils.filename),
    __dirname: toDescriptor(() => utils.dirname),
    import: toDescriptor(() => utils.importModule),
    loadJson: toDescriptor(() => utils.readJson),
    loadJsonSync: toDescriptor(() => utils.readJsonSync),
  })

  return utils
}

export default createEsmUtils
