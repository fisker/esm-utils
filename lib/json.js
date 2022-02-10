import fs, {promises as fsAsync} from 'node:fs'

function createReadJson(base) {
  return async function (file) {
    const url = new URL(file, base)
    const buffer = await fsAsync.readFile(url)
    return JSON.parse(buffer)
  }
}

function createReadJsonSync(base) {
  return function (file) {
    const url = new URL(file, base)
    const buffer = fs.readFileSync(url)
    return JSON.parse(buffer)
  }
}

export {createReadJson, createReadJsonSync}
