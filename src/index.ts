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
    const cell = this.grid[y][x]
    cell.c = c
    cell.fg = fg
    cell.bg = bg
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

export class Cell {
  constructor(public c: string, public fg: number, public bg: number) {}
}

export class Printer {
  public print(s: string): void {
    console.log(s)
  }
}
