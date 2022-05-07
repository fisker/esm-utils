import isRelativePath from './is-relative-path.js'
import {readJson, readJsonSync} from './read-json.js'

const toAbsolute = (file, base) =>
  isRelativePath(file) ? new URL(file, base) : file

function createReadJson(base) {
  return (file) => readJson(toAbsolute(file, base))
}

function createReadJsonSync(base) {
  return (file) => readJsonSync(toAbsolute(file, base))
}

export {createReadJson, createReadJsonSync}
