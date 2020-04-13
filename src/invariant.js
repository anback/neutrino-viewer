// @flow
export default (condition: boolean, format: string, ...args: Array<any>) => {
  if (condition) return true
  var error
  var argIndex = 0
  error = new Error(format.replace(/%s/g, function () { return args[argIndex++] }))
  error.name = 'Invariant Violation'
  throw error
}
