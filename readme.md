# esm-utils

> Utilities you need when migrating to ESModule.

## Install

```bash
yarn add esm-utils
```

## Usage

```js
import createEsmUtils from 'esm-utils'

const {require, dirname, filename, json} = createEsmUtils(import.meta)
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
import json from './path/to/you-json-file.json' assert {type: 'json'}
```

With `require`

```js
import esmUtils from 'esm-utils'

const json = esmUtils.require('./path/to/you-json-file.json')
```

With `json.load`

```js
import esmUtils from 'esm-utils'

const json = await esmUtils.json.load('./path/to/you-json-file.json')
```

## You don't need `dirname` and `filename`

The `dirname` and `filename` supposed to be a quick solution when migrating to ES Modules. In most cases, you don't need them, because many APIs accept `URL` directly.

```js
/* BAD */
import fs from 'node:fs/promises'
import path from 'node:path'
import esmUtils from 'esm-utils'

const {dirname} = esmUtils
const buffer = await fs.readFile(path.join(__dirname, './path/to/file'))
```

```js
/* GOOD */
import fs from 'node:fs/promises'

const buffer = await fs.readFile(new URL('./path/to/file', import.meta.url))
```

## Experimental named export `utils` object

It don't require to create utils with `import.meta`, added to make this module easily to use.

We are **NOT** absolutely sure this is safe to use yet, so it's **NOT recommended** to use in production.

If you find this not working for your case, please [raise an issue](<https://github.com/fisker/esm-utils/issues/new?title=[Bug(default%20export)]:%20>).

```js
import esmUtils from 'esm-utils'

const {require, dirname, filename} = esmUtils
```
