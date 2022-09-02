import { runTest } from 'quizzically'
import { curryN, prop, identity as I } from 'ramda'

import pkg from '../package.json'
const { name: PKG_NAME } = pkg

// import itrace from './trace'

const hurl = e => {
  throw e
}

// const j2 = x => JSON.stringify(x, null, 2)
const j = JSON.stringify

// const expectWillBe = fn => curryN(3, (e, b, a) => e(fn(a)).toEqual(b))

const runWithArgs = curryN(2, (args, expected) =>
  runTest(
    {
      cmd: `./${PKG_NAME}.js`,
      // transformer: pipe(prop('stdout'), JSON.parse),
      transformer: prop('stdout'),
      expect,
      // expectation: expectWillBe(j),
      args,
    },
    hurl,
    I,
    expected
  )
)

describe(`${PKG_NAME} cli`, () => {
  it(`pulls raw .${PKG_NAME}rc`, () =>
    runWithArgs(
      [],
      j({
        where: 'Cool Place Dot Biz',
      })
    ))
  // it('overrides aliases', () =>
  //   runWithArgs(
  //     ['-x', 'bad/**'],
  //     j({
  //       exclude: ['bad/**'],
  //       size: 100,
  //       files: '**/*.*',
  //       lines: 4,
  //       threshold: 95,
  //     })
  //   ))
})
