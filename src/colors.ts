const c = {
  // 6-bit colors from 4x4x4 color cube
  c000: 0b000000,
  c001: 0b000001,
  c002: 0b000010,
  c003: 0b000011,
  c010: 0b000100,
  c011: 0b000101,
  c012: 0b000110,
  c013: 0b000111,
  c020: 0b001000,
  c021: 0b001001,
  c022: 0b001010,
  c023: 0b001011,
  c030: 0b001100,
  c031: 0b001101,
  c032: 0b001110,
  c033: 0b001111,
  c100: 0b010000,
  c101: 0b010001,
  c102: 0b010010,
  c103: 0b010011,
  c110: 0b010100,
  c111: 0b010101,
  c112: 0b010110,
  c113: 0b010111,
  c120: 0b011000,
  c121: 0b011001,
  c122: 0b011010,
  c123: 0b011011,
  c130: 0b011100,
  c131: 0b011101,
  c132: 0b011110,
  c133: 0b011111,
  c200: 0b100000,
  c201: 0b100001,
  c202: 0b100010,
  c203: 0b100011,
  c210: 0b100100,
  c211: 0b100101,
  c212: 0b100110,
  c213: 0b100111,
  c220: 0b101000,
  c221: 0b101001,
  c222: 0b101010,
  c223: 0b101011,
  c230: 0b101100,
  c231: 0b101101,
  c232: 0b101110,
  c233: 0b101111,
  c300: 0b110000,
  c301: 0b110001,
  c302: 0b110010,
  c303: 0b110011,
  c310: 0b110100,
  c311: 0b110101,
  c312: 0b110110,
  c313: 0b110111,
  c320: 0b111000,
  c321: 0b111001,
  c322: 0b111010,
  c323: 0b111011,
  c330: 0b111100,
  c331: 0b111101,
  c332: 0b111110,
  c333: 0b111111,
} as const

export const colors = {
  ...c,
  black: c.c000,
  darkBlue: c.c001,
  mediumBlue: c.c002,
  blue: c.c003,
  darkGreen: c.c010,
  darkCyan: c.c011,
  mediumGreen: c.c020,
  mediumCyan: c.c022,
  deepSkyBlue: c.c023,
  green: c.c030,
  cyan: c.c033,
  darkRed: c.c100,
  darkPurple: c.c102,
  blueViolet: c.c103,
  darkYellow: c.c110,
  darkGrey: c.c111,
  brightCyan: c.c133,
  mediumRed: c.c200,
  purple: c.c203,
  mediumYellow: c.c220,
  lightGrey: c.c222,
  paleTurquoise: c.c233,
  red: c.c300,
  magenta: c.c303,
  orange: c.c320,
  yellow: c.c330,
  white: c.c333,
} as const

export const colorMap6To8 = [
  16, 17, 19, 21, 22, 23, 25, 27, 34, 35, 37, 39, 46, 47, 49, 51, 52, 53, 55, 57, 58, 59,
  61, 63, 70, 71, 73, 75, 82, 83, 85, 87, 124, 125, 127, 129, 130, 131, 133, 135, 142,
  143, 145, 147, 154, 155, 157, 159, 196, 197, 199, 201, 201, 203, 205, 207, 214, 215,
  217, 219, 226, 227, 229, 231,
] as const
