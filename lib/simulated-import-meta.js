function getCallerFile() {
  const originalPrepareStackTrace = Error.prepareStackTrace
  Error.prepareStackTrace = (_, callSites) => callSites
  // eslint-disable-next-line unicorn/error-message
  const callSites = new Error().stack
  Error.prepareStackTrace = originalPrepareStackTrace

  const excludedFiles = new Set([
    // This file self
    import.meta.url,
    // This file will be called in `./utils.js`
    new URL('./utils.js', import.meta.url).href,
  ])

  for (const callSite of callSites) {
    const file = callSite.getFileName()

    if (!excludedFiles.has(file)) {
      return file
    }
  }
}

export default {
  get url() {
    return getCallerFile()
  },
}
