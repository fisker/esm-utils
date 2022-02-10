import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {createRequire} from 'node:module'
import {createReadJson, createReadJsonSync} from './json.js'
import createImport from './import.js'

function create({url: importMetaUrl}) {
  let filename
  let dirname
  let require
  let readJson
  let readJsonSync
  let importFile

  const utils = {
    get filename() {
      return filename || (filename = fileURLToPath(importMetaUrl))
    },
    get dirname() {
      return dirname || (dirname = path.dirname(utils.filename))
    },
    get require() {
      return require || (require = createRequire(importMetaUrl))
    },
    get importFile() {
      return importFile || (importFile = createImport(importMetaUrl))
    },
    get readJson() {
      return readJson || (readJson = createReadJson(importMetaUrl))
    },
    get readJsonSync() {
      return readJsonSync || (readJsonSync = createReadJsonSync(importMetaUrl))
    },

    // Aliases
    get __filename() {
      return utils.filename
    },
    get __dirname() {
      return utils.dirname
    },
    get import() {
      return utils.importFile
    },
    get loadJson() {
      return utils.readJson
    },
    get loadJsonSync() {
      return utils.readJsonSync
    },
    get json() {
      return {
        get read() {
          return utils.readJson
        },
        get readSync() {
          return utils.readJsonSync
        },
        get load() {
          return utils.readJson
        },
        get loadSync() {
          return utils.readJsonSync
        },
      }
    },
  }

  return utils
}

export default create
