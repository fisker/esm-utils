import {fileURLToPath, pathToFileURL} from 'node:url'
import process from 'node:process'
import childProcess from 'node:child_process'
import {isUrl} from 'url-or-path'
import isRelativePath from './is-relative-path.js'

function getModuleUrl(source) {
  if (isUrl(source)) {
    return source
  }

  if (typeof source === 'string' && /^[a-z]:/i.test(source)) {
    return pathToFileURL(source)
  }

  return source
}

function getSyntaxErrorDetails(error, source) {
  if (!(error instanceof SyntaxError) || !error.message || !error.stack) {
    return
  }

  const ERROR_STACK_PREFIX = `SyntaxError: ${error.message}\n`
  if (!error.stack.startsWith(ERROR_STACK_PREFIX)) {
    return
  }

  const stackLines = error.stack.slice(ERROR_STACK_PREFIX.length).split('\n')

  if (
    stackLines.length === 0 ||
    stackLines.some(
      (line) =>
        // TODO: remove `(?:node:?)` when we drop support for Node.js v14
        !/^\s+at\s.*?\((?:node:)?internal\/modules\/esm\/.*?:\d+:\d+\)$/.test(
          line,
        ),
    )
  ) {
    return
  }

  const sourcePath = fileURLToPath(source)
  const {stderr} = childProcess.spawnSync(process.execPath, [sourcePath])
  const message = stderr.toString().replace(/\r\n/g, '\n')

  const index = message.lastIndexOf(ERROR_STACK_PREFIX)

  if (index === -1) {
    return
  }

  return message.slice(0, index).trim()
}

async function importModule(module, options) {
  if (isRelativePath(module)) {
    throw new Error(
      "'module' should be a absolute path or URL." +
        '\n\n' +
        'If you want import a module relative from current file, use `createEsmUtils(import.meta.url).importModule(…)` instead.',
    )
  }

  module = getModuleUrl(module)

  let importError
  try {
    return await import(module)
  } catch (error) {
    importError = error
  }

  const {traceSyntaxError: shouldTraceSyntaxError} = {
    traceSyntaxError: false,
    ...options,
  }

  let details
  if (shouldTraceSyntaxError) {
    try {
      details = getSyntaxErrorDetails(importError, module)
    } catch {}
  }

  if (details) {
    throw new SyntaxError(`${importError.message}:\n\n${details}`)
  }

  throw importError
}

export default importModule
