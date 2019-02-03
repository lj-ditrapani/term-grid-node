export class KeyCodes {
  public readonly esc = '\u001b'
  public readonly enter = '\u000d'
  public readonly arrowUp = '\u001b\u005b\u0041'
  public readonly arrowDown = '\u001b\u005b\u0042'
  public readonly arrowRight = '\u001b\u005b\u0043'
  public readonly arrowLeft = '\u001b\u005b\u0044'

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
}

export const keyCodes = new KeyCodes()
