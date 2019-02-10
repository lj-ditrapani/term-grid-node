import { strict as assert } from 'assert'
import * as sinon from 'sinon'
import { ReadStream } from 'tty'
import { colors, keyCodes, Printer, TermGrid } from '../src/index'

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

    describe('when c.length < 1', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.set(1, 2, '', colors.red, colors.black),
              /set takes a string of length one/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when y is < 0', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.set(-1, 2, 'x', colors.green, colors.black),
              /y index must be >= 0 and < grid height/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when y is > grid height - 1', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.set(3, 2, 'x', colors.green, colors.black),
              /y index must be >= 0 and < grid height/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when x is < 0', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.set(1, -1, 'x', colors.green, colors.black),
              /x index must be >= 0 and < grid width/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when x is > grid width - 1', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.set(1, 4, 'x', colors.green, colors.black),
              /x index must be >= 0 and < grid width/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when fg is too low', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.set(1, 2, 'x', -1, colors.black),
              /6-bit foreground color fg must be in range \[0, 63\] inclusive/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when fg is too high', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.set(1, 2, 'x', 64, colors.black),
              /6-bit foreground color fg must be in range \[0, 63\] inclusive/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when bg is too low', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.set(1, 2, 'x', colors.green, -1),
              /6-bit background color bg must be in range \[0, 63\] inclusive/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when bg is too high', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.set(1, 2, 'x', colors.green, 64),
              /6-bit background color bg must be in range \[0, 63\] inclusive/
            )
          }
        }

        new Test().test()
      })
    })
  })

  describe('text', () => {
    describe('when text overflows grid', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.text(1, 2, 'xyz', colors.green, colors.black),
              /x \+ text.length must be <= grid width/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when y is < 0', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.text(-1, 2, 'x', colors.green, colors.black),
              /y index must be >= 0 and < grid height/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when y is > grid height - 1', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.text(3, 2, 'x', colors.green, colors.black),
              /y index must be >= 0 and < grid height/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when x is < 0', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.text(1, -1, 'x', colors.green, colors.black),
              /x index must be >= 0 and < grid width/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when x is > grid width - 1', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.text(1, 4, 'x', colors.green, colors.black),
              /x index must be >= 0 and < grid width/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when fg is too low', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.text(1, 2, 'x', -1, colors.black),
              /6-bit foreground color fg must be in range \[0, 63\] inclusive/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when fg is too high', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.text(1, 2, 'x', 64, colors.black),
              /6-bit foreground color fg must be in range \[0, 63\] inclusive/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when bg is too low', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.text(1, 2, 'x', colors.green, -1),
              /6-bit background color bg must be in range \[0, 63\] inclusive/
            )
          }
        }

        new Test().test()
      })
    })

    describe('when bg is too high', () => {
      it('throws an error', () => {
        class Test extends Fixture {
          public test() {
            const grid = new TermGrid(3, 4, this.readStream, this.printer)
            assert.throws(
              () => grid.text(1, 2, 'x', colors.green, 64),
              /6-bit background color bg must be in range \[0, 63\] inclusive/
            )
          }
        }

        new Test().test()
      })
    })
  })

  describe('draw', () => {
    it('draws the cells as they have been set with set & text', () => {
      class Test extends Fixture {
        public test() {
          const grid = new TermGrid(2, 3, this.readStream, this.printer)
          let expected
          let actual

          grid.set(0, 0, 'a', colors.red, colors.black)
          grid.set(0, 1, 'b', colors.black, colors.red)
          grid.set(0, 2, 'c', colors.black, colors.red)
          grid.set(1, 0, 'x', colors.blue, colors.black)
          grid.text(1, 1, 'yz', colors.black, colors.blue)
          grid.draw()
          expected = Buffer.from(
            '\u001B[?25l\u001b[0;0H' +
              '\u001b[38;5;196m\u001b[48;5;016ma\u0000\u0000\u0000' +
              '\u001b[38;5;016m\u001b[48;5;196mb\u0000\u0000\u0000' +
              '\u001b[38;5;016m\u001b[48;5;196mc\u0000\u0000\u0000' +
              '\n' +
              '\u001b[38;5;021m\u001b[48;5;016mx\u0000\u0000\u0000' +
              '\u001b[38;5;016m\u001b[48;5;021my\u0000\u0000\u0000' +
              '\u001b[38;5;016m\u001b[48;5;021mz\u0000\u0000\u0000' +
              '\n'
          )
          actual = this.print.getCall(0).args[0]
          assert.deepEqual(actual, expected)
        }
      }

      new Test().test()
    })

    it('erases previous character before writing next', () => {
      class Test extends Fixture {
        public test() {
          const grid = new TermGrid(1, 1, this.readStream, this.printer)
          let expected
          let actual

          grid.set(0, 0, keyCodes.fullBlock, colors.red, colors.black)
          grid.draw()
          expected = Buffer.from(
            '\u001B[?25l\u001b[0;0H' +
            '\u001b[38;5;196m' + // fg red
            '\u001b[48;5;016m' + // bg black
            keyCodes.fullBlock +
            '\u0000' + // char
              '\n'
          )
          actual = this.print.getCall(0).args[0]
          assert.deepEqual(actual, expected)

          grid.set(0, 0, 'x', colors.red, colors.black)
          grid.draw()
          expected = Buffer.from(
            '\u001B[?25l\u001b[0;0H' +
            '\u001b[38;5;196m' + // fg red
            '\u001b[48;5;016m' + // bg black
            'x\u0000\u0000\u0000' + // char
              '\n'
          )
          actual = this.print.getCall(1).args[0]
          assert.deepEqual(actual, expected)

          sinon.assert.calledTwice(this.print)
        }
      }

      new Test().test()
    })
  })
})
// tslint:enable:no-object-literal-type-assertion max-classes-per-file
