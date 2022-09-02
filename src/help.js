import { map, propOr, pipe } from 'ramda'

import { getAliasPairs } from './config-yargs'

import { HELP_STRINGS, ASCII_TEXT, HELP_TEXT } from './constants'

const getHelpString = long => propOr('????', long, HELP_STRINGS)

export const generateHelpFlags = pipe(
  getAliasPairs,
  map(([l, s]) => `-${s} / --${l} - ${getHelpString(l)}`),
  flags => ASCII_TEXT + '\n' + HELP_TEXT + '\n' + flags.join('\n')
)
