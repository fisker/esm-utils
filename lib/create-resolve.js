import {resolve} from 'import-meta-resolve'

function createResolve(base) {
  return (module) => resolve(module, base)
}

export default createResolve
