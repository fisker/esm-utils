import fs, {promises as fsAsync} from 'fs'

class Json {
  constructor(importMeta) {
    this.importMeta = importMeta
  }

  loadSync(relatedPath) {
    const absoluteUrl = new URL(relatedPath, this.importMeta.url)
    const text = fs.readFileSync(absoluteUrl, 'utf8')
    return JSON.parse(text)
  }

  async load(relatedPath) {
    const absoluteUrl = new URL(relatedPath, this.importMeta.url)
    const text = await fsAsync.readFile(absoluteUrl, 'utf8')
    return JSON.parse(text)
  }
}

export default Json
