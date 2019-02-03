const { makeTermGrid, darkCyan, mediumCyan, cyan } = require('./lib/index.js')

const tg = makeTermGrid(10, 30)

tg.clear()
tg.set(1, 1, '%', darkCyan, cyan)
tg.text(2, 2, 'hello', 2, 3)
tg.draw()
tg.set(1, 2, '%', cyan, darkCyan)
tg.text(3, 2, 'world', mediumCyan, 3)
tg.draw()

let x = 0
let y = 0
process.stdin.on( 'data', function( data ){
  // console.log(`GOT [${data}] length: ${data.length} <${[...data].map(c => c.charCodeAt(0))}>`)
  tg.set(5, 5, 'Y', darkCyan, mediumCyan)
  if ( data === '\u006a' ) {
    y += 1
    tg.set(y, x, 'V', cyan, mediumCyan)
  }
  if ( data === '\u006b' ) {
    y -= 1
    tg.set(y, x, '^', mediumCyan, cyan)
  }
  if ( data === '\u006c' ) {
    x += 1
    tg.set(y, x, '(', cyan, mediumCyan)
  }
  if ( data === '\u0068' ) {
    x -= 1
    tg.set(y, x, ')', mediumCyan, cyan)
  }
  tg.draw()
  if ( data === '\u0071' ) {
    tg.reset()
    process.exit();
  }
});
