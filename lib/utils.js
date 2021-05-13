import url from 'node:url'
import path from 'node:path'
import {createRequire} from 'node:module'
import createJsonUtils from './json.js'

function createUtils(importMeta) {
  return {
    get filename() {
      return url.fileURLToPath(importMeta.url)
    },
    get __filename() {
      return this.filename
    },
    get dirname() {
      return path.dirname(this.filename)
    },
    get __dirname() {
      return this.dirname
    },
    get json() {
      return createJsonUtils(importMeta.url)
    },
    get require() {
      return createRequire(importMeta.url)
    },
  }
}

export default createUtils
