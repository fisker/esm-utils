import fs, {promises as fsAsync} from 'node:fs'

function createJsonUtils(url) {
  return {
    async load(file) {
      const fileUrl = new URL(file, url)
      const text = await fsAsync.readFile(fileUrl, 'utf8')
      return JSON.parse(text)
    },
    loadSync(file) {
      const fileUrl = new URL(file, url)
      const text = fs.readFileSync(fileUrl, 'utf8')
      return JSON.parse(text)
    },
  }
}

export default createJsonUtils
