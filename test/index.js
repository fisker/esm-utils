import url from 'url'
import path from 'path'
import test from 'ava'
import {resolve as ponyfillResolve} from 'import-meta-resolve'
import createEsmUtils, {
  importModule,
  readJson,
  loadJson,
  readJsonSync,
  loadJsonSync,
} from '../index.js'

const projectRoot = url.fileURLToPath(new URL('..', import.meta.url))
const packageJsonPath = '../package.json'
const esmUtils = createEsmUtils(import.meta)

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
      createEsmUtils(sourceModule).filename,
      esmUtils.filename,
      `sourceModule '${sourceModule}' didn't work as expected`,
    )
  }
})

test('filename', (t) => {
  t.is(
    esmUtils.filename,
    path.join(projectRoot, 'test/index.js'),
    'Should support `filename`.',
  )
  t.is(
    esmUtils.__filename,
    esmUtils.filename,
    'Should support `__filename` alias.',
  )
  t.throws(() => (esmUtils.filename = '1'))
  t.throws(() => (esmUtils.__filename = '1'))
})

test('dirname', (t) => {
  t.is(
    esmUtils.dirname,
    path.join(projectRoot, 'test'),
    'Should support `dirname`.',
  )
  t.is(
    esmUtils.__dirname,
    esmUtils.dirname,
    'Should support `__dirname` alias.',
  )
  t.throws(() => (esmUtils.dirname = '1'))
  t.throws(() => (esmUtils.__dirname = '1'))
})

test('utils.resolve()', async (t) => {
  const {resolve} = esmUtils

  if (import.meta.resolve) {
    t.is(import.meta.resolve, resolve)
    t.is(import.meta.resolve('ava'), ponyfillResolve('ava', import.meta.url))
  }

  t.is(typeof (await resolve('ava')), 'string')
})

test('utils.{readJson,readJsonSync}', async (t) => {
  const packageJsonUrl = new URL(packageJsonPath, import.meta.url)
  const packageJsonAbsolutePath = url.fileURLToPath(packageJsonUrl)
  const {readJson, readJsonSync} = esmUtils

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
  t.is(esmUtils.readJson, readJson)
  t.is(esmUtils.loadJson, readJson)

  // Alias
  t.is(esmUtils.readJsonSync, readJsonSync)
  t.is(esmUtils.loadJsonSync, readJsonSync)
})

test('utils.require()', (t) => {
  t.is(typeof esmUtils.require, 'function', 'Should support `require`.')
  t.is(
    typeof esmUtils.require.resolve,
    'function',
    '`require.resolve` should work.',
  )
  t.is(
    esmUtils.require(packageJsonPath).name,
    'esm-utils',
    '`require()` should work as expected',
  )
  t.is(
    esmUtils.require.resolve(packageJsonPath),
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

test('utils.importModule()', async (t) => {
  const getModuleDefaultExport = (module) => module.default
  const fixtureUrl = new URL('./fixture.js', import.meta.url)
  const {importModule} = esmUtils

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

  const utilsCreatedFromParent = createEsmUtils(
    new URL('../dummy.js', import.meta.url),
  )
  t.is(
    getModuleDefaultExport(
      await utilsCreatedFromParent.importModule('./test/fixture.js'),
    ),
    fixtureUrl.href,
  )
  await t.throwsAsync(utilsCreatedFromParent.importModule('./fixture.js'), {
    code: 'ERR_MODULE_NOT_FOUND',
  })

  await t.notThrowsAsync(importModule('ava'))
  await t.notThrowsAsync(importModule('node:fs'))
  t.is(esmUtils.import, importModule)
  t.is(esmUtils.importModule, importModule)
})

test('importModule()', async (t) => {
  const getModuleDefaultExport = (module) => module.default
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

async function getErrorStack(fn) {
  let error
  try {
    await fn()
    return
  } catch (syntaxError) {
    error = syntaxError
  }

  return {
    error,
    stackFiles: error.stack
      .split('\n')
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
      esmUtils.importModule('./fixtures/syntax-error-file.js'),
    )
    t.true(!error.message.includes(SYNTAX_ERROR_FILE_URL))
    t.true(
      stackFiles.every((file) =>
        file.startsWith('node:internal/modules/esm/'),
      ) ||
        // TODO: remove this when we drop support for Node.js v14
        stackFiles.every((file) => file.startsWith('internal/modules/esm/')),
    )
  }

  {
    const {error, stackFiles} = await getErrorStack(() =>
      esmUtils.importModule('./fixtures/syntax-error-file.js', {
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
    const {error, stackFiles} = await getErrorStack(() =>
      esmUtils.importModule('./fixtures/importing-syntax-error-file.js', {
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
    () => {
      createEsmUtils().filename
    },
    {
      instanceOf: TypeError,
    },
    'createEsmUtils requires `importMeta`',
  )

  t.is(Object.getPrototypeOf(esmUtils), null)
})
