Term-Grid UI for Nodejs
=======================

Simple 2D color character grid abstraction for terminal apps.


npm package
-----------

<https://www.npmjs.com/package/term-grid-ui>

    npm install --save term-grid-ui


Usage
-----

```typescript
import { colors, keyCodes, makeTermGrid } from 'term-grid-ui'

const tg = makeTermGrid(10, 40)
tg.clear()
tg.set(2, 5, ':', colors.black, colors.white)
tg.draw()
tg.onInput(data => {
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
```


API Documentation
-----------------

<https://lj-ditrapani.github.io/term-grid-node/index.html>


Example
-------

To see an example cd to example/paint:

    npm install
    npm start

and read source in paint.ts for example usage.

![Paint Example App](megaman-paint.png)
![Paint Example App](luigi-paint.png)
![Paint Example App](house-paint.png)


Develop
-------

You'll need node.  I like to use nvm <https://github.com/nvm-sh/nvm>.


### Install npm packages ###

    npm install


### Format, lint, build, test ###

    npm run all


### Visual test ###

    npm run visual-test


### Generate documentation ###

    npm run doc


### View documentation ###

    firefox docs/index.html


### View test coverage report ###

    firefox coverage/lcov-report/index.html


### Update dependencies ###

    npm run ncu

Don't forget to update the example apps!


### Publish ###

    rm -fr lib
    npm run all
    npm version patch/minor/major
    npm login
    npm publish
