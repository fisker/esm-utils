# esm-utils

> Utilities you need when migrating to ESModule.

## Install

```bash
yarn add esm-utils
```

## Usage

```js
import createEsmUtils from 'esm-utils'

const {dirname, filename, json} = createEsmUtils(import.meta)
```

## API

### createEsmUtils(importMeta)

Returns a `object` with the properties

- `dirname` (alias `__dirname`)
- `filename` (alias `__filename`)
- `json`
- `require`

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
