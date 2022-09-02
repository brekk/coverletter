import pkg from '../package.json'
const { name: PKG_NAME } = pkg

export const INITIAL_STATE = {
  total: {
    lines: 0,
    files: 0,
  },
  duplicate: {
    lines: 0,
    files: 0,
    blocks: 0,
    inFile: 0,
  },
}

// .coverletterrc
//
// pitch: string
// skills: [string]
// specificSkills: [string]
// who: string
// where: string

export const HELP_STRINGS = {
  debug: `Enable debug logging. Equivalent to \`DEBUG="${PKG_NAME}:*" ${PKG_NAME}\``,
  help: 'This help text',
  init: `Initialize ${PKG_NAME} in this codebase`,
  pitch: `What's your personal sales pitch?`,
  skills: `What are you good at? Everything you can think of!`,
  specificSkills: `What are you good at for this specific job?`,
  where: `What company are you applying to?`,
  who: `Who are you speaking to for this job position?`,
}

export const yargsConfig = {
  alias: {
    debug: ['d'],
    help: ['h'],
    init: ['n'],
    pitch: ['p'],
    skills: ['s'],
    specificSkills: ['k'],
    where: ['c'],
    who: ['w'],
  },
  array: ['s', 'k'],
  boolean: ['h', 'd', 'n'],
}

export const ASCII_TEXT = `                               ______    __________
_______________   ________________  /______  /__  /_____________
_  ___/  __ \\_ | / /  _ \\_  ___/_  /_  _ \\  __/  __/  _ \\_  ___/
/ /__ / /_/ /_ |/ //  __/  /   _  / /  __/ /_ / /_ /  __/  /
\\___/ \\____/_____/ \\___//_/    /_/  \\___/\\__/ \\__/ \\___//_/`

export const HELP_TEXT = `
When applying to jobs, ${PKG_NAME} will take the drudgery out of mandatory cover letters.

Try using \`${PKG_NAME} --init\`!

Options:`
