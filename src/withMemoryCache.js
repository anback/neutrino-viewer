// @flow
import invariant from 'invariant'

type AsyncFunction = () => Promise<*>

const CACHE = {}
export default (fn: AsyncFunction, key: string): AsyncFunction => {
  invariant(key, key)
  return (...args) => { // TODO remove ...args
    if (CACHE[key]) return Promise.resolve(CACHE[key])
    return fn(...args)
          .then(res => {
            CACHE[key] = res
            return res
          })
  }
}

export const clearCache = (key: string) => { delete CACHE[key] }
