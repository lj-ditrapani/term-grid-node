import { strict as assert } from 'assert'
import * as sinon from 'sinon'
import { ReadStream } from 'tty'
import { colors, Printer, TermGrid } from '../src/index'

// tslint:disable:no-object-literal-type-assertion max-classes-per-file
class Fixture {
  protected readonly print = sinon.stub()
  protected readonly printer = { print: this.print } as Printer
  protected readonly setRawMode = sinon.stub()
  protected readonly resume = sinon.stub()
  protected readonly setEncoding = sinon.stub()
  protected readonly ttyOnEvent = sinon.stub()
  protected readonly readStream = ({
    on: this.ttyOnEvent,
    resume: this.resume,
    setEncoding: this.setEncoding,
    setRawMode: this.setRawMode
  } as unknown) as ReadStream
}

describe('TermGrid', () => {
  describe('constructor', () => {
    it('sets up an instance', () => {
      class Test extends Fixture {
        public test() {
          new TermGrid(3, 4, this.readStream, this.printer).clear()
          sinon.assert.calledWith(this.setRawMode, true)
          sinon.assert.called(this.resume)
          sinon.assert.calledWith(this.setEncoding, 'utf8')
        }
      }

      new Test().test()
    })

    describe('when height is less than 1', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            assert.throws(
              () => new TermGrid(0, 4, this.readStream, this.printer),
              /Height must be positive/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when width is less than 1', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            assert.throws(
              () => new TermGrid(3, 0, this.readStream, this.printer),
              /Width must be positive/
            )
          }
        }

        new Test().test()
      })
    })
  })

  describe('clear', () => {
    it('clears the screen', () => {
      class Test extends Fixture {
        public test() {
          new TermGrid(3, 4, this.readStream, this.printer).clear()
          sinon.assert.calledWith(this.print, '\u001b[2J')
        }
      }

      new Test().test()
    })
  })

  describe('onInput', () => {
    it('attacheds handler to tty on data events', () => {
      class Test extends Fixture {
        public test() {
          const handler = sinon.stub()
          new TermGrid(3, 4, this.readStream, this.printer).onInput(handler)
          sinon.assert.calledWith(this.ttyOnEvent, 'data', handler)
        }
      }

      new Test().test()
    })
  })

  describe('reset', () => {
    it('exits raw mode; restores cursor and cleans up terminal', () => {
      class Test extends Fixture {
        public test() {
          new TermGrid(3, 4, this.readStream, this.printer).reset()
          sinon.assert.calledWith(this.setRawMode, false)
          sinon.assert.calledWith(this.print, '\u001b[0m\u001B[?25h')
        }
      }

      new Test().test()
    })
  })

  describe('set', () => {
    describe('when c.length > 1', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.set(1, 2, 'xx', colors.red, colors.black),
              /set takes a string of length one/
            )
          }
        }

        new Test().test()
      })
    })
  })
})
// tslint:enable:no-object-literal-type-assertion max-classes-per-file
