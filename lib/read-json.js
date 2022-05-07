import fs, {promises as fsPromises} from 'node:fs'
import isRelativePath from './is-relative-path.js'

async function readJson(file) {
  if (isRelativePath(file)) {
    throw new Error(
      "'file' should be a absolute path or URL." +
        '\n\n' +
        'If you want read a JSON file relative from current file, use `createEsmUtils(import.meta.url).readJson(…)` instead.',
    )
  }

  return JSON.parse(await fsPromises.readFile(file))
}

function readJsonSync(file) {
  if (isRelativePath(file)) {
    throw new Error(
      "'file' should be a absolute path or URL." +
        '\n\n' +
        'If you want read a JSON file relative from current file, use `createEsmUtils(import.meta.url).readJsonSync(…)` instead.',
    )
  }

  return JSON.parse(fs.readFileSync(file))
}

export {readJson, readJsonSync}
