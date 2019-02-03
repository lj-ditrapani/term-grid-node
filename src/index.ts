import { strict as assert } from 'assert'

/**
 * Create a TermGrid
 */
export const makeTermGrid = (height: number, width: number): TermGrid =>
  new TermGrid(height, width, new Printer())

/**
 * Represents the terminal as a 2D grid with 256 colors.
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

  constructor(
    private readonly height: number,
    private readonly width: number,
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
    const stdin = process.stdin
    if (stdin.setRawMode) {
      stdin.setRawMode(true)
    }
    stdin.resume()
    stdin.setEncoding('utf8')
  }

  /** Clears the screen with the current background color. Literrally prints "\\u001b[2J". */
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

  /** Reset colors and re-enable the cursor. Literrally prints "\\u001b[0m\\u001B[?25h" */
  public reset(): void {
    if (process.stdin.setRawMode) {
      process.stdin.setRawMode(false)
    }
    this.printer.print(TermGrid.reset)
  }

  /**
   * Set a cell in the grid. You must call draw() to see the change in the terminal.
   *
   * @param y 0-based row index into grid
   * @param x 0-based column index into grid
   * @param c character to set in cell
   * @param fg foreground color to set in cell
   * @param bg background color to set in cell
   */
  public set(y: number, x: number, c: string, fg: number, bg: number): void {
    this.checkBounds(y, x)
    checkColors(fg, bg)
    const cell = this.grid[y][x]
    cell.c = c
    cell.fg = fg
    cell.bg = bg
  }

  public set6Bit(y: number, x: number, c: string, fg: number, bg: number): void {
    this.checkBounds(y, x)
    checkColors6Bit(fg, bg)
    const cell = this.grid[y][x]
    cell.c = c
    cell.fg = colorMap6To8[fg]
    cell.bg = colorMap6To8[bg]
  }

  /**
   * Set a sequence of cells of a row in the grid. Effects n cells where n is the length of text.
   * You must call draw() to see the change in the terminal.
   *
   * @param y 0-based row index into grid
   * @param x 0-based column index into grid
   * @param text text to write in row y starting in column x
   * @param fg foreground color to set to each cell for the text
   * @param bg background color to set to each cell in under text
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

export class Printer {
  public print(s: string): void {
    console.log(s)
  }
}

export const black = 16
export const darkBlue = 17
export const mediumBlue = 19
export const blue = 21
export const darkGreen = 22
export const darkCyan = 23
export const mediumGreen = 34
export const mediumCyan = 37
export const deepSkyBlue = 39
export const green = 46
export const cyan = 51
export const darkRed = 52
export const darkYellow = 58
export const darkGrey = 59
export const brightCyan = 87
export const mediumRed = 124
export const mediumYellow = 142
export const red = 196
export const magenta = 201
export const yellow = 226
export const white = 231

// 6-bit colors from 4x4x4 color cube
export const c000 = 16
export const c001 = 17
export const c002 = 19
export const c003 = 21
export const c010 = 22
export const c011 = 23
export const c012 = 25
export const c013 = 27
export const c020 = 34
export const c021 = 35
export const c022 = 37
export const c023 = 39
export const c030 = 46
export const c031 = 47
export const c032 = 49
export const c033 = 51
export const c100 = 52
export const c101 = 53
export const c102 = 55
export const c103 = 57
export const c110 = 58
export const c111 = 59
export const c112 = 61
export const c113 = 63
export const c120 = 70
export const c121 = 71
export const c122 = 73
export const c123 = 75
export const c130 = 82
export const c131 = 83
export const c132 = 85
export const c133 = 87
export const c200 = 124
export const c201 = 125
export const c202 = 127
export const c203 = 129
export const c210 = 130
export const c211 = 131
export const c212 = 133
export const c213 = 135
export const c220 = 142
export const c221 = 143
export const c222 = 145
export const c223 = 147
export const c230 = 154
export const c231 = 155
export const c232 = 157
export const c233 = 159
export const c300 = 196
export const c301 = 197
export const c302 = 199
export const c303 = 201
export const c310 = 201
export const c311 = 203
export const c312 = 205
export const c313 = 207
export const c320 = 214
export const c321 = 215
export const c322 = 217
export const c323 = 219
export const c330 = 226
export const c331 = 227
export const c332 = 229
export const c333 = 231

const colorMap6To8 = [
  c000,
  c001,
  c002,
  c003,
  c010,
  c011,
  c012,
  c013,
  c020,
  c021,
  c022,
  c023,
  c030,
  c031,
  c032,
  c033,
  c100,
  c101,
  c102,
  c103,
  c110,
  c111,
  c112,
  c113,
  c120,
  c121,
  c122,
  c123,
  c130,
  c131,
  c132,
  c133,
  c200,
  c201,
  c202,
  c203,
  c210,
  c211,
  c212,
  c213,
  c220,
  c221,
  c222,
  c223,
  c230,
  c231,
  c232,
  c233,
  c300,
  c301,
  c302,
  c303,
  c310,
  c311,
  c312,
  c313,
  c320,
  c321,
  c322,
  c323,
  c330,
  c331,
  c332,
  c333
]
