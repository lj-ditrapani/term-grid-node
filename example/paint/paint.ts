import { colors, ITermGrid, keyCodes, makeTermGrid } from 'term-grid-ui'
const { arrowDown, arrowLeft, arrowRight, arrowUp, enter, esc } = keyCodes
const {
  c000,
  c001,
  c002,
  c003,
  c010,
  c020,
  c030,
  c100,
  c200,
  c300,
  c033,
  c303,
  c330,
  c111,
  c222,
  c333,
  c112,
  c323
} = colors

class Paint {
  private mode: 'draw' | 'select-paint' = 'draw'
  private colorIndex: number = 0
  private penPosition: [number, number] = [0, 0]
  private colors: number[] = [
    c000,
    c001,
    c002,
    c003,
    c010,
    c020,
    c030,
    c100,
    c200,
    c300,
    c033,
    c303,
    c330,
    c111,
    c222,
    c333
  ]
  private canvas: number[][]

  constructor(
    private readonly height: number,
    private readonly width: number,
    private readonly tg: ITermGrid
  ) {
    this.canvas = Array(height)
      .fill(null)
      .map(() => Array(width).fill(c333))
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
    const fg = c323
    const bg = c112
    for (const [y, row] of this.canvas.entries()) {
      for (const [x, color] of row.entries()) {
        this.tg.set(y, x, ' ', c000, color)
      }
    }
    for (const [y, color] of this.colors.entries()) {
      this.tg.set(y, 32, ' ', c000, bg)
      this.tg.set(y, 33, ' ', c000, color)
      this.tg.set(y, 34, ' ', c000, color)
    }
    const bgOfPen = this.canvas[this.penPosition[0]][this.penPosition[1]]
    this.tg.set(this.penPosition[0], this.penPosition[1], '*', fg, bgOfPen)
    const bgOfPaintSelection = this.colors[this.colorIndex]
    this.tg.set(this.colorIndex, 33, '<', fg, bgOfPaintSelection)
    this.tg.set(this.colorIndex, 34, '>', fg, bgOfPaintSelection)
    this.tg.text(this.height, 0, ' '.repeat(35), fg, bg)
    this.tg.text(this.height + 1, 0, 'Arrow keys to move in either mode  ', c333, bg)
    this.tg.text(this.height + 2, 0, 'Enter: set pixel or exit paint sel ', c333, bg)
    this.tg.text(this.height + 3, 0, 'Esc: enter paint select mode       ', c333, bg)
    this.tg.text(this.height + 4, 0, 'q: quit application                ', c333, bg)
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
  const tg = makeTermGrid(21, 35)
  const paint = new Paint(16, 32, tg)
  tg.clear()
  paint.draw()
  tg.onInput(paint.input)
}
