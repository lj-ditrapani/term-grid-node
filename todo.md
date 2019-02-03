- raw input
  - fix code to work in raw mode
- examples
- ensure char param to set is string of size one
- names for box drowing characters
  <https://en.wikipedia.org/wiki/Box-drawing_character>
- unit tests
  - color input number bounds
- documentation for missing methods (check)
  - at least for set6bit
- review if any color names should be added
- publish to npm
- consider leveraging
  <https://nodejs.org/docs/latest-v10.x/api/tty.html#tty_readstream_setrawmode_mode>
  TTY api to move cursor, etc, instead of using escape codes for everything?
