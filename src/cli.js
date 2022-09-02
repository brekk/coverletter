import {
  init,
  last,
  head,
  filter,
  __ as $,
  identity as I,
  all,
  always as K,
  ap,
  both,
  chain,
  concat,
  cond,
  ifElse,
  includes,
  join,
  keys,
  length,
  lt,
  map,
  mergeRight,
  of,
  pipe,
  prop,
  propOr,
  reduce,
  reject,
  slice,
  toPairs,
  values,
  zip,
} from 'ramda'
import { resolve, parallel, reject as rejectFuture } from 'fluture'

import { config } from './config'
import { yargsConfig } from './constants'
import { generateHelpFlags } from './help'
import { readFile } from './read'
import { detail as __detail } from './trace'

import { getAlias, parse, findInvalidConfigWithContext } from './config-yargs'

export const getInferredConfig = pipe(
  // process.argv.slice(2)
  slice(2, Infinity),
  // cli argument parser
  parse,
  // we're starting a sub function so that we can capture
  // cliConf as a named variable
  cliConf =>
    // the cosmiconfig wrapper returns a Future,
    // so we must map to access its inner value
    map(conf =>
      pipe(
        __detail('cli config'),
        // convert things to [key, value] pairs
        toPairs,
        // jam together the cosmiconfig derived values
        concat(pipe(__detail('cosmiconfig'), toPairs)(conf)),
        // make sure that we're using the expanded flags
        map(([key, value]) => [getAlias(yargsConfig, key), value]),
        __detail('yooo'),
        // have the cli configuration overwrite the cosmiconfig
        reduce(
          (agg, [k, v]) =>
            mergeRight(agg, {
              [k]: v,
            }),
          cliConf
        ),
        __detail('inferred final config')
      )(cliConf)
    )(config())
)

const quote = l => `"${l}"`

const quoteArray = pipe(map(quote), join(', '))

const formatMissingKeysToError = k =>
  new Error(
    `Unable to understand usage of the ${quoteArray(k)} flag${
      k.length > 1 ? 's' : ''
    }`
  )

const moreThanNone = pipe(length, lt(0))

const getSkill = propOr([], 'skill')
const getAllSkills = propOr({}, 'allSkills')

const hasSkillAndAllSkills = both(
  pipe(getSkill, moreThanNone),
  pipe(getAllSkills, values, moreThanNone)
)
const listedSkillsAreKnown = pipe(
  of,
  ap([pipe(getAllSkills, keys), getSkill]),
  ([a, z]) => all(includes($, a), z)
)

const nonOxfordCommaSummary = pipe(
  of,
  ap([init, last]),
  ([a, fin]) => `${a.join(', ')} and ${fin}`
)

const selectListedSkills = pipe(
  of,
  ap([
    pipe(getAllSkills, toPairs),
    getSkill,
    propOr('', 'pitch'),
    propOr('', 'who'),
  ]),
  ([ax, skills, pitch, who]) =>
    pipe(
      filter(pipe(head, includes($, skills))),
      map(last),
      nonOxfordCommaSummary,
      skillz => who + ',\n\n' + pitch + ' ' + skillz + '.'
    )(ax)
)

// cli :: Config -> Future Error String
export const cli = conf => {
  const findInvalidConfig = findInvalidConfigWithContext(yargsConfig)
  return pipe(
    // figure out the inferred config
    getInferredConfig,
    // based on what that is, do stuff
    // we chain because we want to be able to fail out
    chain(cc =>
      ifElse(
        // test that the check has no matched keys
        pipe(findInvalidConfig, moreThanNone),
        // if so
        pipe(
          findInvalidConfig,
          // convert the unmatched keys to an error
          formatMissingKeysToError,
          // and reject / "throw" in future terms
          rejectFuture
        ),
        // if verify passed
        pipe(
          // check the utility of cond!
          // it takes [[whenX, doX]] functions
          // where whenX is a unary predicate
          // and doX is a unary transformer
          cond([
            [propOr(false, 'debug'), resolve],
            [
              hasSkillAndAllSkills,
              pipe(
                ifElse(listedSkillsAreKnown, selectListedSkills, I),
                resolve
              ),
            ],
            // in every other case, render help text
            [K(true), () => resolve(generateHelpFlags(yargsConfig))],
          ])
        )
      )(cc)
    )
  )(conf)
}
