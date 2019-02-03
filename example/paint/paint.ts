import { keyCodes, makeTermGrid, TermGrid } from 'term-grid-ui'
const { arrowDown, arrowLeft, arrowRight, arrowUp, enter, esc } = keyCodes

class Paint {
  private mode: 'draw' | 'select-paint' = 'draw'
  private colorIndex: number = 0
  private penPosition: [number, number] = [0, 0]
  private colors: number[] = [
    0b000000,
    0b000001,
    0b000010,
    0b000011,
    0b000100,
    0b001000,
    0b001100,
    0b010000,
    0b100000,
    0b110000,
    0b001111,
    0b110011,
    0b111100,
    0b010101,
    0b101010,
    0b111111
  ]
  private canvas: number[][]

  constructor(
    private readonly height: number,
    private readonly width: number,
    private readonly tg: TermGrid
  ) {
    this.canvas = Array(height)
      .fill(null)
      .map(() => Array(width).fill(0b111111))
  }

  public input = (data: string): void => {
    switch (this.mode) {
      case 'draw':
        this.inDrawMode(data)
        break
      case 'select-paint':
        this.inSelectPaintMode(data)
        break
    }
    this.draw()
  }

  public draw(): void {
    const bg = 0b010110
    for (const [y, row] of this.canvas.entries()) {
      for (const [x, color] of row.entries()) {
        this.tg.set6Bit(y, x, ' ', 0, color)
      }
    }
    for (const [y, color] of this.colors.entries()) {
      this.tg.set6Bit(y, 32, ' ', 0, bg)
      this.tg.set6Bit(y, 33, ' ', 0, color)
      this.tg.set6Bit(y, 34, ' ', 0, color)
    }
    const bgOfPen = this.canvas[this.penPosition[0]][this.penPosition[1]]
    this.tg.set6Bit(this.penPosition[0], this.penPosition[1], '*', 0b111011, bgOfPen)
    const bgOfPaintSelection = this.colors[this.colorIndex]
    this.tg.set6Bit(this.colorIndex, 33, '<', 0b111011, bgOfPaintSelection)
    this.tg.set6Bit(this.colorIndex, 34, '>', 0b111011, bgOfPaintSelection)
    this.tg.text(this.height, 0, ' '.repeat(35), 231, 61)
    this.tg.text(this.height + 1, 0, 'Arrow keys to move in either mode  ', 231, 61)
    this.tg.text(this.height + 2, 0, 'Enter: set pixel or exit paint sel ', 231, 61)
    this.tg.text(this.height + 3, 0, 'Esc: enter paint select mode       ', 231, 61)
    this.tg.draw()
  }

  private inDrawMode(data: string): void {
    switch (data) {
      case 'k':
      case arrowUp:
        if (this.penPosition[0] !== 0) {
          this.penPosition = [this.penPosition[0] - 1, this.penPosition[1]]
        }
        break
      case 'j':
      case arrowDown:
        if (this.penPosition[0] !== this.height - 1) {
          this.penPosition = [this.penPosition[0] + 1, this.penPosition[1]]
        }
        break
      case 'l':
      case arrowRight:
        if (this.penPosition[1] !== this.width - 1) {
          this.penPosition = [this.penPosition[0], this.penPosition[1] + 1]
        }
        break
      case 'h':
      case arrowLeft:
        if (this.penPosition[1] !== 0) {
          this.penPosition = [this.penPosition[0], this.penPosition[1] - 1]
        }
        break
      case esc:
        if (this.mode === 'draw') {
          this.mode = 'select-paint'
        }
        break
      case ' ':
      case enter:
        this.canvas[this.penPosition[0]][this.penPosition[1]] = this.colors[
          this.colorIndex
        ]
        break
      case '\u0071':
        this.tg.reset()
        process.exit()
        break
      default:
        break
    }
  }

  private inSelectPaintMode(data: string): void {
    switch (data) {
      case 'k':
      case arrowUp:
        if (this.colorIndex !== 0) {
          this.colorIndex -= 1
        }
        break
      case 'j':
      case arrowDown:
        if (this.colorIndex !== 15) {
          this.colorIndex += 1
        }
        break
      case ' ':
      case enter:
        this.mode = 'draw'
        break
      case '\u0071':
        this.tg.reset()
        process.exit()
        break
      default:
        break
    }
  }
}

{
  const tg = makeTermGrid(20, 35)
  const paint = new Paint(16, 32, tg)

  tg.clear()
  paint.draw()
  process.stdin.on('data', paint.input)
}
