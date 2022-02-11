import url from 'url'
import path from 'path'
import test from 'ava'
import createEsmUtils from '../index.js'

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

test('json', async (t) => {
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
  t.is(esmUtils.json.read, readJson)
  t.is(esmUtils.json.load, readJson)

  // Alias
  t.is(esmUtils.readJsonSync, readJsonSync)
  t.is(esmUtils.loadJsonSync, readJsonSync)
  t.is(esmUtils.json.readSync, readJsonSync)
  t.is(esmUtils.json.loadSync, readJsonSync)

  // Cached
  t.is(esmUtils.json, esmUtils.json)
})

test('require', (t) => {
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

test('importFile()', async (t) => {
  const getModuleDefaultExport = (module) => module.default
  const fixtureUrl = new URL('./fixture.js', import.meta.url)
  const {importFile} = esmUtils

  t.is(typeof importFile(fixtureUrl).then, 'function')
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
      getModuleDefaultExport(await importFile(source)),
      fixtureUrl.href,
      `Import '${source}' failure`,
    )
  }

  await t.throwsAsync(importFile('ava'), {code: 'ERR_MODULE_NOT_FOUND'})
  t.is(esmUtils.import, importFile)
  t.is(esmUtils.importFile, importFile)
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
  t.is(Object.getPrototypeOf(esmUtils.json), null)
})
