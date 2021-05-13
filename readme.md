# esm-utils

> Utilities you need when migrating to ESModule.

## Install

```bash
yarn add esm-utils
```

## Usage

```js
import createEsmUtils from 'esm-utils'

const {dirname, filename, require} = createEsmUtils(import.meta)
```

## API

### createEsmUtils(importMeta)

Returns a `object` with the properties

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
import createEsmUtils from 'esm-utils'

const {require} = createEsmUtils(import.meta)
const json = require('./path/to/you-json-file.json')
```

With `json.load`

```js
import createEsmUtils from 'esm-utils'

const {json} = createEsmUtils(import.meta)
const json = await json.load('./path/to/you-json-file.json')
```

## You don't need `dirname` and `filename`

The `dirname` and `filename` supposed to be a quick solution when migrating to ES Modules. In most cases, you don't need them because many APIs accept `URL` directly.

```diff
import fs from 'node:fs/promises'
- import path from 'node:path'
- import createEsmUtils from 'esm-utils'

- const {dirname} = createEsmUtils(import.meta)
const text = await fs.readFile(
-  path.join(dirname, './foo.text'),
+  new URL('./foo.text', import.meta.url)
  'utf8'
)
```
