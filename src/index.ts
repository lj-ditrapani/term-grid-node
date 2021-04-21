import { colorMap6To8, colors } from './colors'
export { blockElements, boxDrawing, keyCodes } from './character_codes'
import { ReadStream } from 'tty'
export { colors } from './colors'
import { strict as assert } from 'assert'

/**
 * Represents the terminal as a 2D grid with 64 colors.
 * Each cell has a foreground color fg, a background color bg and a unicode
 * text character.
 * Create an instance with the makeTermGrid factory function.
 *
 * <p>Typical usage might have a setup, a core function, and a shutdown.
 *
 * <p>Setup: the setup would call clear() to clean up the screen.
 *    Then attach an input event handler function with the onInput method.
 *    The handler should either be the core function or call the core function.
 *
 * <p> Core function: called for each input/other event.  Example:
 *
 * <ul>
 *   <li>Interpret event
 *   <li>Apply business logic
 *   <li>Update grid with several calls to set() and/or text() methods
 *   <li>Call draw() to display the new grid state on the terminal
 * </ul>
 *
 * <p>Shutdown: call reset() to return the terminal to normal.
 *
 * <p>A fg or bg color is a 6-bit RGB color from a 4x4x4 RGB color cube.
 *    A value in the range [0-63] inclusive.  The bits in the number are RRGGBB.
 *    In other words, 2 bits per color component; in order red, green, then blue.
 *    For example if the color is 0b011011, then red is 1, green is 2 and blue is 3.
 */
export interface ITermGrid {
  /**
   * Clears the screen with the current background color.
   * Literally prints "\\u001b[2J".
   */
  clear(): void

  /** Draw the current state of the grid to the terminal. */
  draw(): void

  /**
   * Whenever the terminal receives user keystrokes, calls handler passing in
   * the utf-8 encoded string representing the key strokes
   */
  onInput(handler: (data: string) => void): void

  /** Reset colors and re-enable the cursor. Literally prints "\\u001b[0m\\u001B[?25h" */
  reset(): void

  /**
   * Set a cell in the grid. You must call draw() to see the change in the terminal.
   *
   * @param y 0-based row index into grid
   * @param x 0-based column index into grid
   * @param c character to set in cell
   * @param fg 6-bit RGB foreground color to set for the cell.
   *           Must be in range [0-63] inclusive.
   * @param bg 6-bit RGB background color to set for the cell.
   *           Must be in range [0-63] inclusive.
   */
  set(y: number, x: number, c: string, fg: number, bg: number): void

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
   * @param bg 6-bit background color to set to each cell.
   *           Must be in range [0-63] inclusive.
   */
  text(y: number, x: number, text: string, fg: number, bg: number): void
}

/**
 * Create a TermGrid
 */
export const makeTermGrid = (height: number, width: number): ITermGrid => {
  if (process.stdin.isTTY) {
    return new TermGrid(height, width, process.stdin as ReadStream, new Printer())
  } else {
    throw new Error('process.stdin must be a tty for term-grid-ui to work')
  }
}

export class TermGrid implements ITermGrid {
  private static readonly clear = '\u001b[2J'
  private static readonly init = '\u001B[?25l\u001b[0;0H'
  private static readonly reset = '\u001b[0m\u001B[?25h'
  private static readonly initSize = Buffer.byteLength(TermGrid.init)
  private readonly grid: Cell[][]
  private readonly buffer: Buffer

  /**
   * For internal unit testing only.
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
    const fg = colorMap6To8[colors.darkPurple]
    const bg = colorMap6To8[colors.lightGrey]
    this.grid = Array(height)
      .fill(null)
      .map(() =>
        Array(width)
          .fill(null)
          .map(() => new Cell('.', fg, bg))
      )
    this.tty.setRawMode(true)
    this.tty.resume()
    this.tty.setEncoding('utf8')
    // Each cell needs 26 bytes:
    // - 11 to set fg color
    // - 11 to set bg color
    // - 4 for utf8 unicode char (unused bytes will be null 0x00)
    this.buffer = Buffer.alloc(TermGrid.initSize + height * width * 26 + height)
    this.buffer.write(TermGrid.init)
    this.grid.forEach((row, y) => {
      const yOffset = TermGrid.initSize + y * (this.width * 26 + 1)
      row.forEach((_cell, x) => {
        const offset = yOffset + x * 26
        this.buffer.write('\u001b[38;5;', offset)
        this.buffer.write('m\u001b[48;5;', offset + 10)
        this.buffer.write('m', offset + 21)
      })
      this.buffer.write('\n', yOffset + this.width * 26)
    })
  }

  public clear(): void {
    this.printer.print(TermGrid.clear)
  }

  public draw(): void {
    this.grid.forEach((row, y) => {
      const yOffset = TermGrid.initSize + y * (this.width * 26 + 1)
      row.forEach((cell, x) => {
        const offset = yOffset + x * 26
        this.buffer.write(('' + cell.fg).padStart(3, '0'), offset + 7)
        this.buffer.write(('' + cell.bg).padStart(3, '0'), offset + 18)
        this.buffer.write('\u0000\u0000\u0000\u0000', offset + 22)
        this.buffer.write(cell.c, offset + 22)
      })
    })
    this.printer.print(this.buffer)
  }

  public onInput(handler: (data: string) => void): void {
    this.tty.on('data', handler)
  }

  public reset(): void {
    this.tty.setRawMode(false)
    this.printer.print(TermGrid.reset)
  }

  public set(y: number, x: number, c: string, fg: number, bg: number): void {
    assert(c.length === 1, 'set takes a string of length one as c (a character)')
    this.checkBounds(y, x)
    checkColors(fg, bg)
    this.unsafeSet(y, x, c, colorMap6To8[fg], colorMap6To8[bg])
  }

  public text(y: number, x: number, text: string, fg: number, bg: number): void {
    this.checkBounds(y, x)
    checkColors(fg, bg)
    const fg8Bit = colorMap6To8[fg]
    const bg8Bit = colorMap6To8[bg]
    assert(x + text.length <= this.width, 'x + text.length must be <= grid width')
    let currX = x
    for (let i = 0; i < text.length; i++) {
      const c = text.charAt(i)
      this.unsafeSet(y, currX, c, fg8Bit, bg8Bit)
      ++currX
    }
  }

  private checkBounds(y: number, x: number): void {
    assert(y >= 0 && y < this.height, 'y index must be >= 0 and < grid height')
    assert(x >= 0 && x < this.width, 'x index must be >= 0 and < grid width')
  }

  private unsafeSet(y: number, x: number, c: string, fg8: number, bg8: number): void {
    const cell = this.grid[y][x]
    cell.c = c
    cell.fg = fg8
    cell.bg = bg8
  }
}

const checkColors = (fg: number, bg: number): void => {
  checkColor(fg, 'foreground', 'fg')
  checkColor(bg, 'background', 'bg')
}

const checkColor = (color: number, desc: string, name: string): void => {
  assert(
    color <= 63 && color >= 0,
    `6-bit ${desc} color ${name} must be in range [0, 63] inclusive`
  )
}

class Cell {
  constructor(public c: string, public fg: number, public bg: number) {}
}

/**
 * Console abstraction.
 * Only exists to make TermGrid more testable.
 * You should not need to use this.
 * Use makeTermGrid factory function directly.
 */
export class Printer {
  public print(data: Buffer | string): void {
    process.stdout.write(data)
  }
}
