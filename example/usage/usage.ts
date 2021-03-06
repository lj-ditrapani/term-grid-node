import { colors, keyCodes, makeTermGrid } from 'term-grid-ui'

const tg = makeTermGrid(10, 40)
tg.clear()
tg.set(2, 5, ':', colors.black, colors.white)
tg.text(7, 2, 'Press Enter to see message', colors.black, colors.white)
tg.text(8, 2, 'Press q to quit', colors.black, colors.white)
tg.draw()
tg.onInput((data) => {
  switch (data) {
    case keyCodes.enter:
      tg.text(1, 1, 'Hello world!', colors.green, colors.black)
      break
    case 'q':
      tg.reset()
      process.exit()
  }
  tg.draw()
})
