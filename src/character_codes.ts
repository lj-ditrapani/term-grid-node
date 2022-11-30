/**
 * Keyboard characters
 **/
export const keyCodes = {
  esc: '\u001b',
  enter: '\u000d',
  arrowUp: '\u001b\u005b\u0041',
  arrowDown: '\u001b\u005b\u0042',
  arrowRight: '\u001b\u005b\u0043',
  arrowLeft: '\u001b\u005b\u0044',
} as const

export const boxDrawing = {
  boxLightHori: '\u2500', // ─
  boxHeavyHori: '\u2501', // ━
  boxLightVert: '\u2502', // │
  boxHeavyVert: '\u2503', // ┃
  boxLight3DashHori: '\u2504', // ┄
  boxheavy3DashHori: '\u2505', // ┅
  boxLight3DashVert: '\u2506', // ┆
  boxheavy3DashVert: '\u2507', // ┇
  boxLight4DashHori: '\u2508', // ┈
  boxheavy4DashHori: '\u2509', // ┉
  boxLight4DashVert: '\u250A', // ┊
  boxheavy4DashVert: '\u250B', // ┋
  boxLightDownRight: '\u250C', // ┌
  boxHeavyDownRight: '\u250F', // ┏
  boxLightDownLeft: '\u2510', // ┐
  boxHeavyDownLeft: '\u2513', // ┓
  boxLightUpRight: '\u2514', // └
  boxHeavyUpRight: '\u2517', // ┗
  boxLightUpLeft: '\u2518', // ┘
  boxHeavyUpLeft: '\u251B', // ┛
  boxLight2DashHori: '\u254C', // ╌
  boxHeavy2DashHori: '\u254D', // ╍
  boxLight2DashVert: '\u254E', // ╎
  boxHeavy2DashVert: '\u254F', // ╏
  boxSlash: '\u2571', // ╱
  boxBackSlash: '\u2572', // ╲
  boxX: '\u2573', // ╳
} as const

export const blockElements = {
  upper12Block: '\u2580', // ▀
  lower18Block: '\u2581', // ▁
  lower14Block: '\u2582', // ▂
  lower38Block: '\u2583', // ▃
  lower12Block: '\u2584', // ▄
  lower58Block: '\u2585', // ▅
  lower34Block: '\u2586', // ▆
  lower78Block: '\u2587', // ▇
  fullBlock: '\u2588', // █
  left78Block: '\u2589', // ▉
  left34Block: '\u258a', // ▊
  left58Block: '\u258b', // ▋
  left12Block: '\u258c', // ▌
  left38Block: '\u258d', // ▍
  left14Block: '\u258e', // ▎
  left18Block: '\u258f', // ▏
  right12Block: '\u2590', // ▐
  lightShadeBlock: '\u2591', // ░
  mediumShadeBlock: '\u2592', // ▒
  darkShadeBlock: '\u2593', // ▓
  upper18Block: '\u2594', // ▔
  right18Block: '\u2595', // ▕
  quadrantLowerLeft: '\u2596', // ▖
  quadrantLowerRight: '\u2597', // ▗
  quadrantUpperLeft: '\u2598', // ▘
  quadrantNotUpperRight: '\u2599', // ▙
  quadrantUpperLeftLowerRight: '\u259A', // ▚
  quadrantNotLowerRight: '\u259B', // ▛
  quadrantNotLowerLeft: '\u259C', // ▜
  quadrantUpperRight: '\u259D', // ▝
  quadrantUpperRightLowerLeft: '\u259E', // ▞
  quadrantNotUpperLeft: '\u259F', // ▟
} as const
