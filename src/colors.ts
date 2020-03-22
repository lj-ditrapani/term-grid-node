export class Colors {
  // 6-bit colors from 4x4x4 color cube
  public readonly c000 = 0b000000
  public readonly c001 = 0b000001
  public readonly c002 = 0b000010
  public readonly c003 = 0b000011
  public readonly c010 = 0b000100
  public readonly c011 = 0b000101
  public readonly c012 = 0b000110
  public readonly c013 = 0b000111
  public readonly c020 = 0b001000
  public readonly c021 = 0b001001
  public readonly c022 = 0b001010
  public readonly c023 = 0b001011
  public readonly c030 = 0b001100
  public readonly c031 = 0b001101
  public readonly c032 = 0b001110
  public readonly c033 = 0b001111
  public readonly c100 = 0b010000
  public readonly c101 = 0b010001
  public readonly c102 = 0b010010
  public readonly c103 = 0b010011
  public readonly c110 = 0b010100
  public readonly c111 = 0b010101
  public readonly c112 = 0b010110
  public readonly c113 = 0b010111
  public readonly c120 = 0b011000
  public readonly c121 = 0b011001
  public readonly c122 = 0b011010
  public readonly c123 = 0b011011
  public readonly c130 = 0b011100
  public readonly c131 = 0b011101
  public readonly c132 = 0b011110
  public readonly c133 = 0b011111
  public readonly c200 = 0b100000
  public readonly c201 = 0b100001
  public readonly c202 = 0b100010
  public readonly c203 = 0b100011
  public readonly c210 = 0b100100
  public readonly c211 = 0b100101
  public readonly c212 = 0b100110
  public readonly c213 = 0b100111
  public readonly c220 = 0b101000
  public readonly c221 = 0b101001
  public readonly c222 = 0b101010
  public readonly c223 = 0b101011
  public readonly c230 = 0b101100
  public readonly c231 = 0b101101
  public readonly c232 = 0b101110
  public readonly c233 = 0b101111
  public readonly c300 = 0b110000
  public readonly c301 = 0b110001
  public readonly c302 = 0b110010
  public readonly c303 = 0b110011
  public readonly c310 = 0b110100
  public readonly c311 = 0b110101
  public readonly c312 = 0b110110
  public readonly c313 = 0b110111
  public readonly c320 = 0b111000
  public readonly c321 = 0b111001
  public readonly c322 = 0b111010
  public readonly c323 = 0b111011
  public readonly c330 = 0b111100
  public readonly c331 = 0b111101
  public readonly c332 = 0b111110
  public readonly c333 = 0b111111

  public readonly black = this.c000
  public readonly darkBlue = this.c001
  public readonly mediumBlue = this.c002
  public readonly blue = this.c003
  public readonly darkGreen = this.c010
  public readonly darkCyan = this.c011
  public readonly mediumGreen = this.c020
  public readonly mediumCyan = this.c022
  public readonly deepSkyBlue = this.c023
  public readonly green = this.c030
  public readonly cyan = this.c033
  public readonly darkRed = this.c100
  public readonly darkPurple = this.c102
  public readonly blueViolet = this.c103
  public readonly darkYellow = this.c110
  public readonly darkGrey = this.c111
  public readonly brightCyan = this.c133
  public readonly mediumRed = this.c200
  public readonly purple = this.c203
  public readonly mediumYellow = this.c220
  public readonly lightGrey = this.c222
  public readonly paleTurquoise = this.c233
  public readonly red = this.c300
  public readonly magenta = this.c303
  public readonly orange = this.c320
  public readonly yellow = this.c330
  public readonly white = this.c333
}

export const colors = new Colors()

export const colorMap6To8 = [
  16,
  17,
  19,
  21,
  22,
  23,
  25,
  27,
  34,
  35,
  37,
  39,
  46,
  47,
  49,
  51,
  52,
  53,
  55,
  57,
  58,
  59,
  61,
  63,
  70,
  71,
  73,
  75,
  82,
  83,
  85,
  87,
  124,
  125,
  127,
  129,
  130,
  131,
  133,
  135,
  142,
  143,
  145,
  147,
  154,
  155,
  157,
  159,
  196,
  197,
  199,
  201,
  201,
  203,
  205,
  207,
  214,
  215,
  217,
  219,
  226,
  227,
  229,
  231,
]
