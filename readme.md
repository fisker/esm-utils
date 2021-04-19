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

Returns a `object` with the properties `dirname`, `filename`, and `json`.

### `json.load(relatedPath)`

Returns `Promise<jsonObject>`.

### `json.loadSync(relatedPath)`

Sync version of `json.load`.
