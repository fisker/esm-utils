# esm-utils

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
  json,
} = createEsmUtils(import.meta)
```

## API

### `createEsmUtils(import.meta)`

Returns an `object` with the following properties:

- `require`
- `dirname` (alias `__dirname`)
- `filename` (alias `__filename`)
- `json`

**Please read [this note](#you-dont-need-dirname-and-filename) before you use `dirname` and `filename`**

### `json.load(string | URL)`

Returns `Promise<jsonObject>`.

### `json.loadSync(string | URL)`

Sync version of `json.load`.

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

With `json.load` or `json.loadSync`

```js
import createEsmUtils from 'esm-utils'

const {json} = createEsmUtils(import.meta)
const foo = await json.load('./foo.json')
```

```js
import createEsmUtils from 'esm-utils'

const {json} = createEsmUtils(import.meta)
const foo = json.loadSync('./foo.json')
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
