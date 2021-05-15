function getFileName(parentFile) {
  const originalPrepareStackTrace = Error.prepareStackTrace
  Error.prepareStackTrace = (_, callSites) => callSites
  // eslint-disable-next-line unicorn/error-message
  const {stack} = new Error()
  Error.prepareStackTrace = originalPrepareStackTrace

  return stack
    .find((callSite) => {
      const filename = callSite.getFileName()
      return filename !== import.meta.url && filename !== parentFile
    })
    .getFileName()
}

export default getFileName
