import url from 'url'
import path from 'path'
import test from 'ava'
import createEsmUtils from '../index.js'

const projectRoot = url.fileURLToPath(new URL('..', import.meta.url))
const esmUtils = createEsmUtils(import.meta)

test('filename', (t) => {
  t.is(esmUtils.filename, path.join(projectRoot, 'test/index.js'))
})

test('dirname', (t) => {
  t.is(esmUtils.dirname, path.join(projectRoot, 'test'))
})

test('json.load', async (t) => {
  const promise = esmUtils.json.load('../package.json')
  const packageJson = await promise
  t.is(typeof promise.then, 'function')
  t.is(packageJson.name, 'esm-utils')
})

test('json.loadSync', (t) => {
  const packageJson = esmUtils.json.loadSync('../package.json')
  t.is(packageJson.name, 'esm-utils')
})

test('require', (t) => {
  t.is(typeof esmUtils.require, 'function')
  t.is(typeof esmUtils.require.resolve, 'function')

  t.is(esmUtils.require('../package.json').name, 'esm-utils')
  t.is(
    esmUtils.require.resolve('../package.json'),
    path.join(projectRoot, 'package.json')
  )
})
