import {pathToFileURL, fileURLToPath} from 'node:url'
import process from 'node:process'
import childProcess from 'node:child_process'
import {isUrl} from 'url-or-path'

function getModuleSource(source, base) {
  if (isUrl(source)) {
    return source
  }

  if (typeof source === 'string' && /^[a-z]:/i.test(source)) {
    return pathToFileURL(source)
  }

  if (source.startsWith('.')) {
    return new URL(source, base)
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

const createImport = (base) => async (source, options) => {
  source = getModuleSource(source, base)

  let importError
  try {
    return await import(source)
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
      details = getSyntaxErrorDetails(importError, source)
    } catch {}
  }

  if (details) {
    throw new SyntaxError(`${importError.message}:\n\n${details}`)
  }

  throw importError
}

export default createImport
