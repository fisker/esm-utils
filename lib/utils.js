import url from 'url'
import path from 'path'
import Json from './json.js'

class Utils {
  constructor(importMeta) {
    this.importMeta = importMeta
  }

  get dirname() {
    return path.dirname(this.filename)
  }

  get filename() {
    return url.fileURLToPath(this.importMeta.url)
  }

  get json() {
    return new Json(this.importMeta)
  }
}

function utils(importMeta) {
  return new Utils(importMeta)
}

export default utils
