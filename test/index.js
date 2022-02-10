import url from 'url'
import path from 'path'
import test from 'ava'
import createEsmUtils from '../index.js'

const projectRoot = url.fileURLToPath(new URL('..', import.meta.url))
const packageJsonPath = '../package.json'
const esmUtils = createEsmUtils(import.meta)

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
})

test('json', async (t) => {
  const packageJsonUrl = new URL(packageJsonPath, import.meta.url)

  const promise = esmUtils.json.load(packageJsonPath)
  const packageJson = await promise
  t.is(
    typeof promise.then,
    'function',
    '`json.load()` should return `Promise`.',
  )
  t.is(packageJson.name, 'esm-utils', '`json.load()` should work as expected.')
  t.deepEqual(
    await esmUtils.json.load(packageJsonUrl),
    packageJson,
    '`json.load()` should work on `URL` too.',
  )
  t.deepEqual(
    esmUtils.json.loadSync(packageJsonPath),
    packageJson,
    'Should support `json.loadSync()`.',
  )
  t.deepEqual(
    esmUtils.json.loadSync(packageJsonUrl),
    packageJson,
    '`json.loadSync()` should work on `URL` too.',
  )
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

test('import()', async (t) => {
  const getModuleDefaultExport = (module) => module.default
  const fixtureUrl = new URL('./fixture.js', import.meta.url)

  t.is(typeof esmUtils.import(fixtureUrl).then, 'function')
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
      getModuleDefaultExport(await esmUtils.import(source)),
      fixtureUrl.href,
      `Import '${source}' failure`,
    )
  }

  await t.throwsAsync(esmUtils.import('ava'), {code: 'ERR_MODULE_NOT_FOUND'})
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
})
