/**
 * Keyboard characters
 **/
export class KeyCodes {
  public readonly esc = '\u001b'
  public readonly enter = '\u000d'
  public readonly arrowUp = '\u001b\u005b\u0041'
  public readonly arrowDown = '\u001b\u005b\u0042'
  public readonly arrowRight = '\u001b\u005b\u0043'
  public readonly arrowLeft = '\u001b\u005b\u0044'
}

export class BoxDrawing {
  public readonly boxLightHori = '\u2500' // ─
  public readonly boxHeavyHori = '\u2501' // ━
  public readonly boxLightVert = '\u2502' // │
  public readonly boxHeavyVert = '\u2503' // ┃
  public readonly boxLight3DashHori = '\u2504' // ┄
  public readonly boxheavy3DashHori = '\u2505' // ┅
  public readonly boxLight3DashVert = '\u2506' // ┆
  public readonly boxheavy3DashVert = '\u2507' // ┇
  public readonly boxLight4DashHori = '\u2508' // ┈
  public readonly boxheavy4DashHori = '\u2509' // ┉
  public readonly boxLight4DashVert = '\u250A' // ┊
  public readonly boxheavy4DashVert = '\u250B' // ┋
  public readonly boxLightDownRight = '\u250C' // ┌
  public readonly boxHeavyDownRight = '\u250F' // ┏
  public readonly boxLightDownLeft = '\u2510' // ┐
  public readonly boxHeavyDownLeft = '\u2513' // ┓
  public readonly boxLightUpRight = '\u2514' // └
  public readonly boxHeavyUpRight = '\u2517' // ┗
  public readonly boxLightUpLeft = '\u2518' // ┘
  public readonly boxHeavyUpLeft = '\u251B' // ┛
  public readonly boxLight2DashHori = '\u254C' // ╌
  public readonly boxHeavy2DashHori = '\u254D' // ╍
  public readonly boxLight2DashVert = '\u254E' // ╎
  public readonly boxHeavy2DashVert = '\u254F' // ╏
  public readonly boxSlash = '\u2571' // ╱
  public readonly boxBackSlash = '\u2572' // ╲
  public readonly boxX = '\u2573' // ╳
}

export class BlockElements {
  public readonly upper12Block = '\u2580' // ▀
  public readonly lower18Block = '\u2581' // ▁
  public readonly lower14Block = '\u2582' // ▂
  public readonly lower38Block = '\u2583' // ▃
  public readonly lower12Block = '\u2584' // ▄
  public readonly lower58Block = '\u2585' // ▅
  public readonly lower34Block = '\u2586' // ▆
  public readonly lower78Block = '\u2587' // ▇
  public readonly fullBlock = '\u2588' // █
  public readonly left78Block = '\u2589' // ▉
  public readonly left34Block = '\u258a' // ▊
  public readonly left58Block = '\u258b' // ▋
  public readonly left12Block = '\u258c' // ▌
  public readonly left38Block = '\u258d' // ▍
  public readonly left14Block = '\u258e' // ▎
  public readonly left18Block = '\u258f' // ▏
  public readonly right12Block = '\u2590' // ▐
  public readonly lightShadeBlock = '\u2591' // ░
  public readonly mediumShadeBlock = '\u2592' // ▒
  public readonly darkShadeBlock = '\u2593' // ▓
  public readonly upper18Block = '\u2594' // ▔
  public readonly right18Block = '\u2595' // ▕
  public readonly quadrantLowerLeft = '\u2596' // ▖
  public readonly quadrantLowerRight = '\u2597' // ▗
  public readonly quadrantUpperLeft = '\u2598' // ▘
  public readonly quadrantNotUpperRight = '\u2599' // ▙
  public readonly quadrantUpperLeftLowerRight = '\u259A' // ▚
  public readonly quadrantNotLowerRight = '\u259B' // ▛
  public readonly quadrantNotLowerLeft = '\u259C' // ▜
  public readonly quadrantUpperRight = '\u259D' // ▝
  public readonly quadrantUpperRightLowerLeft = '\u259E' // ▞
  public readonly quadrantNotUpperLeft = '\u259F' // ▟
}

export const keyCodes = new KeyCodes()
export const boxDrawing = new BoxDrawing()
export const blockElements = new BlockElements()
