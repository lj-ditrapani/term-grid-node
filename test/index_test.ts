import { strict as assert } from 'assert'
import * as sinon from 'sinon'
import { ReadStream } from 'tty'
import { Printer, TermGrid } from '../src/index'

// tslint:disable:no-object-literal-type-assertion
describe('TermGrid', () => {
  describe('clear', () => {
    it('clears the screen', () => {
      const print = sinon.stub()
      const printer = { print } as Printer
      const readStream = (sinon.stub() as unknown) as ReadStream
      new TermGrid(3, 4, readStream, printer).clear()
      assert(false)
    })
  })
})
// tslint:enable:no-object-literal-type-assertion
