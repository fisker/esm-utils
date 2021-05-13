import fs, {promises as fsAsync} from 'node:fs'

function createJsonUtils(base) {
  return {
    async load(file) {
      const url = new URL(file, base)
      const text = await fsAsync.readFile(url, 'utf8')
      return JSON.parse(text)
    },
    loadSync(file) {
      const url = new URL(file, base)
      const text = fs.readFileSync(url, 'utf8')
      return JSON.parse(text)
    },
  }
}

export default createJsonUtils
