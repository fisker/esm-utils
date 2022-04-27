import {pathToFileURL, fileURLToPath} from 'node:url'
import process from 'node:process'
import {execFile} from 'node:child_process'
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

async function fixError(error, source) {
  if (!(error instanceof SyntaxError)) {
    return
  }

  const {message: errorMessage, stack: errorStack} = error
  const ERROR_STACK_PREFIX = `SyntaxError: ${errorMessage}\n`
  if (!errorStack.startsWith(ERROR_STACK_PREFIX)) {
    return
  }

  const [nodePath] = process.argv
  const sourcePath = fileURLToPath(source)
  const execError = await new Promise((resolve) => {
    execFile(nodePath, [sourcePath], (error) => {
      resolve(error)
    })
  })

  if (!execError) {
    return
  }

  let {message} = execError
  const EXPECTED_EXEC_ERROR_MESSAGE_PREFIX = `Command failed: ${nodePath} ${sourcePath}\n`

  if (!message.startsWith(EXPECTED_EXEC_ERROR_MESSAGE_PREFIX)) {
    return
  }
  message = message.slice(EXPECTED_EXEC_ERROR_MESSAGE_PREFIX.length)
  message = message.replaceAll(/\r\n/g, '\n').trimEnd()
  if (!message.endsWith(errorStack)) {
    return
  }

  const index = message.lastIndexOf(ERROR_STACK_PREFIX)
  if (index === -1) {
    return
  }

  const detail = message.slice(0, index).trim()

  error.message = `${errorMessage}:\n\n${detail}`
  error.stack = `SyntaxError: ${error.message}\n${errorStack.slice(
    ERROR_STACK_PREFIX.length,
  )}`
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

  if (shouldTraceSyntaxError) {
    try {
      await fixError(importError, source)
    } catch {}
  }

  throw importError
}

export default createImport
