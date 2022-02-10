import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {createRequire} from 'node:module'
import {createJsonReader, createJsonSyncReader} from './json.js'
import createImport from './import.js'

function create(importMeta) {
  let filename
  let dirname
  let require
  let jsonReader
  let jsonSyncReader
  let importFile

  const utils = {
    get filename() {
      return filename || (filename = fileURLToPath(importMeta.url))
    },
    get dirname() {
      return dirname || (dirname = path.dirname(utils.filename))
    },
    get require() {
      return require || (require = createRequire(importMeta.url))
    },
    get importFile() {
      return importFile || (importFile = createImport(importMeta.url))
    },
    get readJson() {
      return jsonReader || (jsonReader = createJsonReader(importMeta.url))
    },
    get readJsonSync() {
      return (
        jsonSyncReader ||
        (jsonSyncReader = createJsonSyncReader(importMeta.url))
      )
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
