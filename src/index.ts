import { strict as assert } from 'assert'

export const makeTermGrid = (height: number, width: number): TermGrid =>
  new TermGrid(height, width, new Printer())

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

  public clear(): void {
    this.printer.print(TermGrid.clear)
  }

  public reset(): void {
    this.printer.print(TermGrid.reset)
  }

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

  public set(y: number, x: number, c: string, fg: number, bg: number): void {
    this.checkBounds(y, x)
    const cell = this.grid[y][x]
    cell.c = c
    cell.fg = fg
    cell.bg = bg
  }

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
