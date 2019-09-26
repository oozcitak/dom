import $$ from './TestHelpers'

describe('StaticRange', () => {

  test('constructor throws', () => {
    expect(() => new $$.StaticRange()).toThrow()
  })

})