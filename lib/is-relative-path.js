function isRelativePath(path) {
  return typeof path === 'string' && path.startsWith('.')
}

export default isRelativePath
