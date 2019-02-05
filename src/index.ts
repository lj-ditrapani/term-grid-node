import { strict as assert } from 'assert'
import { ReadStream } from 'tty'
import { colorMap6To8 } from './colors'
export { colors } from './colors'
export { keyCodes } from './key_codes'

/**
 * Create a TermGrid
 */
export const makeTermGrid = (height: number, width: number): TermGrid => {
  if (process.stdin.setRawMode) {
    return new TermGrid(height, width, process.stdin as ReadStream, new Printer())
  } else {
    throw new Error('process.stdin must be a tty for term-grid-ui to work')
  }
}

/**
 * Represents the terminal as a 2D grid with 256 colors.
 * Create an instance with the makeTermGrid factory function.
 *
 * <p>Typical usage might have a setup, a main loop, and a shutdown.
 *
 * <p>The setup would call clear() to clean up the screen. Example main loop:
 *
 * <ul>
 *   <li>User input/other event
 *   <li>Business logic
 *   <li>Update grid with several calls to set() and/or text() methods
 *   <li>Call draw() to display the new grid state on the terminal
 *   <li>Repeat
 * </ul>
 *
 * <p>Shutdown: call reset() to return the terminal to normal.
 *
 * <p>A color byte is an index into one of the 256 ANSI Xterm colors <a
 * href="https://jonasjacek.github.io/colors/">https://jonasjacek.github.io/colors/</a>
 */
export class TermGrid {
  private static readonly clear = '\u001b[2J'
  private static readonly init = '\u001B[?25l\u001b[0;0H'
  private static readonly reset = '\u001b[0m\u001B[?25h'
  private readonly grid: Cell[][]

  /**
   * For unit testing only.
   * Use makeTermGrid factory function instead.
   */
  constructor(
    private readonly height: number,
    private readonly width: number,
    private readonly tty: ReadStream,
    private readonly printer: Printer
  ) {
    assert(this.height >= 1, 'Height must be positive.')
    assert(this.width >= 1, 'Width must be positive.')
    this.grid = Array(height)
      .fill(null)
      .map(() =>
        Array(width)
          .fill(null)
          .map(() => new Cell('.', 9, 7))
      )
    this.tty.setRawMode(true)
    this.tty.resume()
    this.tty.setEncoding('utf8')
  }

  /**
   * Clears the screen with the current background color.
   * Literrally prints "\\u001b[2J".
   */
  public clear(): void {
    this.printer.print(TermGrid.clear)
  }

  /** Draw the current state of the grid to the terminal. */
  public draw(): void {
    let str = TermGrid.init
    for (const row of this.grid) {
      for (const cell of row) {
        str += '\u001b[38;5;'
        str += cell.fg
        str += 'm\u001b[48;5;'
        str += cell.bg
        str += 'm'
        str += cell.c
      }
      str += '\n'
    }
    this.printer.print(str)
  }

  public onInput(handler: (data: string) => void): void {
    this.tty.on('data', handler)
  }

  /** Reset colors and re-enable the cursor. Literrally prints "\\u001b[0m\\u001B[?25h" */
  public reset(): void {
    this.tty.setRawMode(false)
    this.printer.print(TermGrid.reset)
  }

  /**
   * Set a cell in the grid. You must call draw() to see the change in the terminal.
   * fg and bg are color bytes; indexes into one of the 256 ANSI Xterm colors.
   *
   * @param y 0-based row index into grid
   * @param x 0-based column index into grid
   * @param c character to set in cell
   * @param fg foreground color to set in cell.  Must be in range [0-255] inclusive.
   * @param bg background color to set in cell.  Must be in range [0-255] inclusive.
   */
  public set(y: number, x: number, c: string, fg: number, bg: number): void {
    assert(c.length === 1, 'set takes a string of length one as c (a character)')
    this.checkBounds(y, x)
    checkColors(fg, bg)
    const cell = this.grid[y][x]
    cell.c = c
    cell.fg = fg
    cell.bg = bg
  }

  /**
   * Set a cell in the grid. You must call draw() to see the change in the terminal.
   * fg and bg are color bytes; indexes into one of the 256 ANSI Xterm colors.
   *
   * @param y 0-based row index into grid
   * @param x 0-based column index into grid
   * @param c character to set in cell
   * @param fg 6-bit foreground color to set to each cell for the text.
   *           Must be in range [0-63] inclusive.
   * @param bg 6-bit background color to set to each cell in under text.
   *           Must be in range [0-63] inclusive.
   */
  public set6Bit(y: number, x: number, c: string, fg: number, bg: number): void {
    this.checkBounds(y, x)
    checkColors6Bit(fg, bg)
    const cell = this.grid[y][x]
    cell.c = c
    cell.fg = colorMap6To8[fg]
    cell.bg = colorMap6To8[bg]
  }

  /**
   * Set a sequence of cells of a row in the grid.
   * Effects n cells where n is the length of text.
   * You must call draw() to see the change in the terminal.
   *
   * @param y 0-based row index into grid
   * @param x 0-based column index into grid
   * @param text text to write in row y starting in column x
   * @param fg foreground color to set in cell.  Must be in range [0-255] inclusive.
   * @param bg background color to set in cell.  Must be in range [0-255] inclusive.
   */
  public text(y: number, x: number, text: string, fg: number, bg: number): void {
    this.checkBounds(y, x)
    checkColors(fg, bg)
    assert(x + text.length <= this.width, 'x + text.length must be <= grid width')
    let currX = x
    for (let i = 0; i < text.length; i++) {
      const c = text.charAt(i)
      this.set(y, currX, c, fg, bg)
      ++currX
    }
  }

  /**
   * Set a sequence of cells of a row in the grid.
   * Effects n cells where n is the length of text.
   * You must call draw() to see the change in the terminal.
   *
   * @param y 0-based row index into grid
   * @param x 0-based column index into grid
   * @param text text to write in row y starting in column x
   * @param fg 6-bit foreground color to set to each cell for the text.
   *           Must be in range [0-63] inclusive.
   * @param bg 6-bit background color to set to each cell in under text.
   *           Must be in range [0-63] inclusive.
   */
  public text6Bit(y: number, x: number, text: string, fg: number, bg: number): void {
    this.checkBounds(y, x)
    checkColors6Bit(fg, bg)
    assert(x + text.length <= this.width, 'x + text.length must be <= grid width')
    let currX = x
    for (let i = 0; i < text.length; i++) {
      const c = text.charAt(i)
      this.set6Bit(y, currX, c, fg, bg)
      ++currX
    }
  }

  private checkBounds(y: number, x: number): void {
    assert(y >= 0 && y < this.height, 'y index must by >= 0 and < grid height')
    assert(x >= 0 && x < this.width, 'x index must by >= 0 and < grid width')
  }
}

const checkColors = (fg: number, bg: number): void => {
  assert(
    fg <= 255 && fg >= 0,
    '8-bit foreground color fg must be in range [0, 255] inclusive'
  )
  assert(
    bg <= 255 && bg >= 0,
    '8-bit background color bg must be in range [0, 255] inclusive'
  )
}

const checkColors6Bit = (fg: number, bg: number): void => {
  assert(
    fg <= 63 && fg >= 0,
    '6-bit foreground color fg must be in range [0, 63] inclusive'
  )
  assert(
    bg <= 63 && bg >= 0,
    '6-bit background color bg must be in range [0, 63] inclusive'
  )
}

class Cell {
  constructor(public c: string, public fg: number, public bg: number) {}
}

/**
 * Console abstraction
 * Only exists to make TermGrid more testable.
 * You should not need to use this.
 * Use makeTermGrid factory function directly..
 */
export class Printer {
  public print(s: string): void {
    console.log(s)
  }
}
