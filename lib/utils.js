import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {createRequire} from 'node:module'
import createJsonUtils from './json.js'
import createImport from './import.js'

function create(importMeta) {
  return {
    get filename() {
      return fileURLToPath(importMeta.url)
    },
    get dirname() {
      return path.dirname(this.filename)
    },
    get require() {
      return createRequire(importMeta.url)
    },
    get json() {
      return createJsonUtils(importMeta.url)
    },
    get importFile() {
      return createImport(importMeta.url)
    },
    // Aliases
    get __filename() {
      return this.filename
    },
    get __dirname() {
      return this.dirname
    },
    get import() {
      return this.importFile
    },
  }
}

export default create
