import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {createRequire} from 'node:module'
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

function createEsmUtils({url: importMetaUrl}) {
  const utils = createObject({
    filename: toDescriptor(() => fileURLToPath(importMetaUrl)),
    dirname: toDescriptor(() => path.dirname(utils.filename)),
    require: toDescriptor(() => createRequire(importMetaUrl)),
    importFile: toDescriptor(() => createImport(importMetaUrl)),
    readJson: toDescriptor(() => createReadJson(importMetaUrl)),
    readJsonSync: toDescriptor(() => createReadJsonSync(importMetaUrl)),

    // Aliases
    __filename: toDescriptor(() => utils.filename),
    __dirname: toDescriptor(() => utils.dirname),
    import: toDescriptor(() => utils.importFile),
    loadJson: toDescriptor(() => utils.readJson),
    loadJsonSync: toDescriptor(() => utils.readJsonSync),
    json: toDescriptor(() =>
      createObject({
        read: toDescriptor(() => utils.readJson),
        load: toDescriptor(() => utils.readJson),
        readSync: toDescriptor(() => utils.readJsonSync),
        loadSync: toDescriptor(() => utils.readJsonSync),
      }),
    ),
  })

  return utils
}

export default createEsmUtils
