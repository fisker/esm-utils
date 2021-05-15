import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {createRequire} from 'node:module'
import createJsonUtils from './json.js'
import getFileName from './get-filename.js'

function create(importMeta) {
  importMeta = importMeta || {
    get url() {
      return getFileName(import.meta.url)
    },
  }

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
    // Aliases
    get __filename() {
      return this.filename
    },
    get __dirname() {
      return this.dirname
    },
  }
}

export default create
