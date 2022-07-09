import { blockElements, colors, keyCodes, makeTermGrid } from './lib/index'
const { darkBlue, white, darkCyan, mediumCyan, cyan } = colors
const {
  arrowUp,
  arrowDown,
  arrowRight,
  arrowLeft,
} = keyCodes
const {
  lightShadeBlock,
  mediumShadeBlock,
  darkShadeBlock,
} = blockElements

const tg = makeTermGrid(10, 30)

tg.clear()
tg.set(1, 1, '%', darkCyan, cyan)
tg.text(2, 2, 'hello', white, darkBlue)
tg.draw()
tg.set(1, 2, '%', cyan, darkCyan)
tg.set(6, 5, lightShadeBlock, cyan, darkCyan)
tg.set(6, 6, mediumShadeBlock, cyan, darkCyan)
tg.set(6, 7, darkShadeBlock, cyan, darkCyan)
tg.text(3, 2, 'world', mediumCyan, 3)
tg.draw()

let x = 0
let y = 0
tg.onInput((data) => {
  tg.set(5, 5, 'Y', darkCyan, mediumCyan)
  const str = [...data].map((c) => c.charCodeAt(0).toString(16)).join('')
  tg.text(8, 0, '............', 0, 0)
  tg.text(8, 0, str, darkCyan, mediumCyan)
  if (data === 'j' || data === arrowDown) {
    y += 1
    tg.set(y, x, 'V', cyan, mediumCyan)
  }
  if (data === 'k' || data === arrowUp) {
    y -= 1
    tg.set(y, x, '^', mediumCyan, cyan)
  }
  if (data === 'l' || data === arrowRight) {
    x += 1
    tg.set(y, x, '(', cyan, mediumCyan)
  }
  if (data === 'h' || data === arrowLeft) {
    x -= 1
    tg.set(y, x, ')', mediumCyan, cyan)
  }
  if (data === 'x') {
    tg.set(7, 2, 'X', mediumCyan, cyan)
  }
  tg.draw()
  if (data === 'q') {
    tg.reset()
    process.exit()
  }
})
