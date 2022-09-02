import {
  __ as $,
  append,
  curryN,
  concat,
  reduce,
  curry,
  defaultTo,
  either,
  equals,
  find,
  fromPairs,
  head,
  includes,
  last,
  map,
  pipe,
  propOr,
  reject,
  toPairs,
} from 'ramda'
import rawParser from 'yargs-parser'

import { info as __info } from './trace'
import { yargsConfig } from './constants'

// get a structured [preferred, alias] list from a given yargsConfig
// getAliasPairs :: YargsConfig -> List #[String, String]
export const getAliasPairs = pipe(
  // grab alias or {}
  propOr({}, 'alias'),
  // conver to pairs
  toPairs,
  // since the short flags are array-wrapped, flatten that for ease of consumption
  map(([k, [v]]) => [k, v])
)

// get just the short flags
// getShortAliases :: YargsConfig -> List String
export const getShortAliases = pipe(getAliasPairs, map(last))

// getFullAlias :: YargsConfig -> String -> [String, [String]]
export const getFullAlias = curry((yc, k) =>
  pipe(
    getAliasPairs,
    // look for k in [k, [k]]
    find(either(pipe(head, equals(k)), pipe(last, includes(k)))),
    // find can fail, so provide a default
    defaultTo([k])
  )(yc)
)

// getAlias :: YargsConfig -> String -> String
export const getAlias = curry((yc, k) => pipe(getFullAlias(yc), head)(k))

// findInvalidConfig
export const findInvalidConfigWithContext = curry((yc, conf) => {
  console.log({ yc, conf })
  return pipe(
    getAliasPairs,
    __info('pairs'),
    reduce(concat, []),
    __info('joined'),
    aliases =>
      pipe(
        __info('aliases'),
        toPairs,
        reject(([key]) => key === '_'),
        __info('pears'),
        reduce((agg, [k]) => (includes(k, aliases) ? agg : append(k, agg)), [])
      )(conf)
  )(yc)
})

// wrap raw yargs-parser with curry
export const argsParser = curryN(2, rawParser)

// partially apply for default case
export const parse = argsParser($, yargsConfig)
