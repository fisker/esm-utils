import path from 'node:path'
import {pathToFileURL} from 'node:url'
import fs, {promises as fsAsync} from 'node:fs'

function toUrl(file, base) {
  if (typeof file === 'string' && path.isAbsolute(file)) {
    return pathToFileURL(file)
  }

  return new URL(file, base)
}

function createReadJson(base) {
  return async function (file) {
    const url = toUrl(file, base)
    const buffer = await fsAsync.readFile(url)
    return JSON.parse(buffer)
  }
}

function createReadJsonSync(base) {
  return function (file) {
    const url = toUrl(file, base)
    const buffer = fs.readFileSync(url)
    return JSON.parse(buffer)
  }
}

export {createReadJson, createReadJsonSync}
