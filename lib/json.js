import fs, {promises as fsAsync} from 'node:fs'

function createJsonUtils(base) {
  return {
    async load(file) {
      const url = new URL(file, base)
      const buffer = await fsAsync.readFile(url)
      return JSON.parse(buffer)
    },
    loadSync(file) {
      const url = new URL(file, base)
      const buffer = fs.readFileSync(url)
      return JSON.parse(buffer)
    },
  }
}

export default createJsonUtils
