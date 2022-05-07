import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {createRequire} from 'node:module'
import {toUrl} from 'url-or-path'
import {createReadJson, createReadJsonSync} from './json.js'
import createImport from './import.js'

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
const getModuleUrl = (sourceModule) => sourceModule.url || toUrl(sourceModule)

function createEsmUtils(sourceModule) {
  sourceModule = getModuleUrl(sourceModule)

  const utils = createObject({
    // Path
    filename: toDescriptor(() => fileURLToPath(sourceModule)),
    dirname: toDescriptor(() => path.dirname(utils.filename)),

    // Module
    require: toDescriptor(() => createRequire(sourceModule)),
    importModule: toDescriptor(() => createImport(sourceModule)),

    // JSON
    readJson: toDescriptor(() => createReadJson(sourceModule)),
    readJsonSync: toDescriptor(() => createReadJsonSync(sourceModule)),

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
