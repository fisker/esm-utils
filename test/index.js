import path from 'node:path'
import process from 'node:process'
import url from 'node:url'
import test from 'ava'
import {resolve as ponyfillResolve} from 'import-meta-resolve'
import createEsmUtilities, {
  importModule,
  loadJson,
  loadJsonSync,
  readJson,
  readJsonSync,
} from '../index.js'

const projectRoot = url.fileURLToPath(new URL('..', import.meta.url))
const packageJsonPath = '../package.json'
const esmUtilities = createEsmUtilities(import.meta)

test('createEsmUtils', (t) => {
  for (const sourceModule of [
    // `file:///`
    import.meta.url,
    // `URL`
    new URL(import.meta.url),
    // Absolute path
    url.fileURLToPath(import.meta.url),
  ]) {
    t.is(
      createEsmUtilities(sourceModule).filename,
      esmUtilities.filename,
      `sourceModule '${sourceModule}' didn't work as expected`,
    )
  }
})

test('filename', (t) => {
  t.is(
    esmUtilities.filename,
    path.join(projectRoot, 'test/index.js'),
    'Should support `filename`.',
  )
  t.is(
    esmUtilities.__filename,
    esmUtilities.filename,
    'Should support `__filename` alias.',
  )
  t.throws(() => {
    esmUtilities.filename = '1'
  })
  t.throws(() => {
    esmUtilities.__filename = '1'
  })
})

test('dirname', (t) => {
  t.is(
    esmUtilities.dirname,
    path.join(projectRoot, 'test'),
    'Should support `dirname`.',
  )
  t.is(
    esmUtilities.__dirname,
    esmUtilities.dirname,
    'Should support `__dirname` alias.',
  )
  t.throws(() => {
    esmUtilities.dirname = '1'
  })
  t.throws(() => {
    esmUtilities.__dirname = '1'
  })
})

test('utils.resolve()', async (t) => {
  const {resolve} = esmUtilities

  if (import.meta.resolve) {
    t.is(import.meta.resolve, resolve)
    t.is(import.meta.resolve('ava'), ponyfillResolve('ava', import.meta.url))
  }

  t.is(typeof (await resolve('ava')), 'string')
})

test('utils.{readJson,readJsonSync}', async (t) => {
  const packageJsonUrl = new URL(packageJsonPath, import.meta.url)
  const packageJsonAbsolutePath = url.fileURLToPath(packageJsonUrl)
  const {readJson, readJsonSync} = esmUtilities

  const packageJson = await readJson(packageJsonPath)
  t.is(packageJson.name, 'esm-utils', '`readJson()` should work as expected.')
  t.deepEqual(
    await readJson(packageJsonUrl),
    packageJson,
    '`readJson()` should work on `URL` too.',
  )
  t.deepEqual(
    await readJson(packageJsonAbsolutePath),
    packageJson,
    '`readJson()` should work on absolute path too.',
  )

  const packageJsonSync = readJsonSync(packageJsonPath)
  t.deepEqual(
    packageJsonSync,
    packageJson,
    '`readJsonSync()` should work as expected.',
  )
  t.deepEqual(
    readJsonSync(packageJsonUrl),
    packageJson,
    '`readJsonSync()` should work on `URL` too.',
  )
  t.deepEqual(
    readJsonSync(packageJsonAbsolutePath),
    packageJson,
    '`readJsonSync()` should work on absolute path too.',
  )

  // Alias
  t.is(esmUtilities.readJson, readJson)
  t.is(esmUtilities.loadJson, readJson)

  // Alias
  t.is(esmUtilities.readJsonSync, readJsonSync)
  t.is(esmUtilities.loadJsonSync, readJsonSync)
})

test('utils.require()', (t) => {
  t.is(typeof esmUtilities.require, 'function', 'Should support `require`.')
  t.is(
    typeof esmUtilities.require.resolve,
    'function',
    '`require.resolve` should work.',
  )
  t.is(
    esmUtilities.require(packageJsonPath).name,
    'esm-utils',
    '`require()` should work as expected',
  )
  t.is(
    esmUtilities.require.resolve(packageJsonPath),
    path.join(projectRoot, 'package.json'),
    '`require.resolve()` should work as expected',
  )
})

test('{readJson,readJsonSync}', async (t) => {
  const packageJsonUrl = new URL(packageJsonPath, import.meta.url)
  const packageJsonAbsolutePath = url.fileURLToPath(packageJsonUrl)

  const packageJson = await readJson(packageJsonUrl)
  t.is(packageJson.name, 'esm-utils', '`readJson()` should work as expected.')
  t.deepEqual(
    await readJson(packageJsonAbsolutePath),
    packageJson,
    '`readJson()` should work on absolute path too.',
  )

  const packageJsonSync = readJsonSync(packageJsonUrl)
  t.deepEqual(
    packageJsonSync,
    packageJson,
    '`readJsonSync()` should work as expected.',
  )
  t.deepEqual(
    readJsonSync(packageJsonAbsolutePath),
    packageJson,
    '`readJsonSync()` should work on absolute path too.',
  )

  // Relative path
  await t.throwsAsync(readJson('./non-exits'), {
    message: /^'file' should be a absolute path or URL\./,
  })
  t.throws(() => readJsonSync('./non-exits'), {
    message: /^'file' should be a absolute path or URL\./,
  })

  // Alias
  t.is(loadJson, readJson)
  t.is(loadJsonSync, readJsonSync)
})

const getModuleDefaultExport = (module) => module.default
test('utils.importModule()', async (t) => {
  const fixtureUrl = new URL('./fixture.js', import.meta.url)
  const {importModule} = esmUtilities

  t.is(typeof importModule(fixtureUrl).then, 'function')
  for (const source of [
    // Relative path
    './fixture.js',
    // `URL`
    fixtureUrl,
    // `file:///`
    fixtureUrl.href,
    // Absolute path
    url.fileURLToPath(fixtureUrl),
  ]) {
    t.is(
      getModuleDefaultExport(await importModule(source)),
      fixtureUrl.href,
      `Import '${source}' failure`,
    )
  }

  const utilitiesCreatedFromParent = createEsmUtilities(
    new URL('../dummy.js', import.meta.url),
  )
  t.is(
    getModuleDefaultExport(
      await utilitiesCreatedFromParent.importModule('./test/fixture.js'),
    ),
    fixtureUrl.href,
  )
  await t.throwsAsync(utilitiesCreatedFromParent.importModule('./fixture.js'), {
    code: 'ERR_MODULE_NOT_FOUND',
  })

  await t.notThrowsAsync(importModule('ava'))
  await t.notThrowsAsync(importModule('node:fs'))
  t.is(esmUtilities.import, importModule)
  t.is(esmUtilities.importModule, importModule)
})

test('importModule()', async (t) => {
  const fixtureUrl = new URL('./fixture.js', import.meta.url)

  t.is(typeof importModule(fixtureUrl).then, 'function')
  for (const source of [
    // `URL`
    fixtureUrl,
    // `file:///`
    fixtureUrl.href,
    // Absolute path
    url.fileURLToPath(fixtureUrl),
  ]) {
    t.is(
      getModuleDefaultExport(await importModule(source)),
      fixtureUrl.href,
      `Import '${source}' failure`,
    )
  }

  // Relative path
  await t.throwsAsync(importModule('./non-exits'), {
    message: /^'module' should be a absolute path or URL\./,
  })

  await t.notThrowsAsync(importModule('ava'))
  await t.notThrowsAsync(importModule('node:fs'))
})

async function getErrorStack(function_) {
  let error
  try {
    await function_()
    return
  } catch (syntaxError) {
    error = syntaxError
  }

  return {
    error,
    stackFiles: error.stack
      .split('\n')
      // eslint-disable-next-line sonarjs/slow-regex, regexp/no-super-linear-backtracking
      .map((line) => line.match(/^\s+at\s.*?\((?<file>.*?):\d+:\d+\)$/))
      .filter(Boolean)
      .map((match) => match.groups.file),
  }
}

test('importModule() with `traceSyntaxError`', async (t) => {
  const SYNTAX_ERROR_FILE_URL = new URL(
    './fixtures/syntax-error-file.js',
    import.meta.url,
  ).href

  {
    const {error, stackFiles} = await getErrorStack(() =>
      esmUtilities.importModule('./fixtures/syntax-error-file.js'),
    )
    t.true(!error.message.includes(SYNTAX_ERROR_FILE_URL))
    console.log({stackFiles})
    t.true(
      stackFiles.every((file) =>
        file.startsWith('node:internal/modules/esm/'),
      ) ||
        // TODO: remove this when we drop support for Node.js v14
        stackFiles.every((file) => file.startsWith('internal/modules/esm/')),
    )
  }

  {
    const {error} = await getErrorStack(() =>
      esmUtilities.importModule('./fixtures/syntax-error-file.js', {
        traceSyntaxError: true,
      }),
    )
    t.true(error.message.includes(SYNTAX_ERROR_FILE_URL))
    const message = error.message.replace(
      url.pathToFileURL(process.cwd()).href,
      '<CWD>',
    )
    t.true(message.includes('Unexpected identifier'))
  }

  {
    const {error} = await getErrorStack(() =>
      esmUtilities.importModule('./fixtures/importing-syntax-error-file.js', {
        traceSyntaxError: true,
      }),
    )
    t.true(error.message.includes(SYNTAX_ERROR_FILE_URL))
    const message = error.message.replace(
      url.pathToFileURL(process.cwd()).href,
      '<CWD>',
    )
    t.true(message.includes('Unexpected identifier'))
  }
})

test('exports', (t) => {
  t.throws(
    () => createEsmUtilities().filename,
    {
      instanceOf: TypeError,
    },
    'createEsmUtils requires `importMeta`',
  )

  t.is(Object.getPrototypeOf(esmUtilities), null)
})
