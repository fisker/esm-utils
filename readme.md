# esm-utils

[![Build Status][github_actions_badge]][github_actions_link]
[![Coverage][coveralls_badge]][coveralls_link]
[![Npm Version][package_version_badge]][package_link]
[![MIT License][license_badge]][license_link]

[github_actions_badge]: https://img.shields.io/github/workflow/status/fisker/esm-utils/CI/main?style=flat-square
[github_actions_link]: https://github.com/fisker/esm-utils/actions?query=branch%3Amain
[coveralls_badge]: https://img.shields.io/coveralls/github/fisker/esm-utils/main?style=flat-square
[coveralls_link]: https://coveralls.io/github/fisker/esm-utils?branch=main
[license_badge]: https://img.shields.io/npm/l/esm-utils.svg?style=flat-square
[license_link]: https://github.com/fisker/esm-utils/blob/main/license
[package_version_badge]: https://img.shields.io/npm/v/esm-utils.svg?style=flat-square
[package_link]: https://www.npmjs.com/package/esm-utils

> Utilities you'll need when migrating to ESModule.

## Install

```bash
yarn add esm-utils
```

## Usage

<!-- prettier-ignore -->
```js
import createEsmUtils from 'esm-utils'

const {
  require,
  dirname,
  filename,
  readJson,
  readJsonSync,
  importFile,
} = createEsmUtils(import.meta)
```

## API

### `createEsmUtils(import.meta)`

Returns an `object` with the following properties:

- `require`
- `dirname` (alias `__dirname`)
- `filename` (alias `__filename`)
- `readJson` (alias `loadJson`)
- `readJsonSync` (alias `loadJsonSync`)
- `importFile` (alias `import`)
- `json`

**Please read [this note](#you-dont-need-dirname-and-filename) before you use `dirname` and `filename`**

### `readJson(string | URL)`

Returns `Promise<jsonObject>`.

### `readJsonSync(string | URL)`

Sync version of `readJson`.

### `json`

- `json.{read,load}` alias of `readJson`
- `json.{read,load}Sync` alias of `readJsonSync`

### `importFile(string | URL)`

> Don't use this to import a NPM module

Same as `import()`, but accepts absolute path (on Windows, `import('C:\\foo.js')` error throws when pass a absolute path starts with a drive letter).

## Import json file

With [`Import Assertions`](https://github.com/tc39/proposal-import-assertions)

```js
import foo from './foo.json' assert {type: 'json'}
```

```json
await import('./foo.json', {assert: {type: 'json'}})
```

With `require`, like CommonJS

```js
import createEsmUtils from 'esm-utils'

const {require} = createEsmUtils(import.meta)
const foo = require('./foo.json')
```

With `readJson` or `readJsonSync`

```js
import createEsmUtils from 'esm-utils'

const {readJson} = createEsmUtils(import.meta)
const foo = await readJson('./foo.json')
```

```js
import createEsmUtils from 'esm-utils'

const {readJsonSync} = createEsmUtils(import.meta)
const foo = readJsonSync('./foo.json')
```

## You don't need `dirname` and `filename`

The `dirname` and `filename` supposed to be a quick solution when migrating to ES Modules. In most cases, you don't need them, because many APIs accept `URL` directly.

<!-- prettier-ignore -->
```js
/* BAD */
import fs from 'node:fs/promises'
import path from 'node:path'
import createEsmUtils from 'esm-utils'

const {dirname} = createEsmUtils(import.meta)
const buffer = await fs.readFile(
  path.join(dirname, './path/to/file')
)
```

<!-- prettier-ignore -->
```js
/* GOOD */
import fs from 'node:fs/promises'

const buffer = await fs.readFile(
  new URL('./path/to/file', import.meta.url)
)
```
