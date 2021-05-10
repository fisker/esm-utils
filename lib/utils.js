import url from 'node:url'
import path from 'node:path'
import {createRequire} from 'node:module'
import Json from './json.js'

class Utils {
  constructor(importMeta) {
    this.importMeta = importMeta
  }

  get dirname() {
    return path.dirname(this.filename)
  }

  get __dirname() {
    return this.dirname
  }

  get filename() {
    return url.fileURLToPath(this.importMeta.url)
  }

  get __filename() {
    return this.filename
  }

  get json() {
    return new Json(this.importMeta)
  }

  get require() {
    return createRequire(this.importMeta.url)
  }
}

function utils(importMeta) {
  return new Utils(importMeta)
}

export default utils
