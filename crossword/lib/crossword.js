import { Word } from "./word.js";

export class Crossword {

  constructor(x, y, words) {
    this.x = x;
    this.y = y;
    this.words = words;
  }

  static compare(aCrossword, anotherCrossword) {
    if (aCrossword === null && anotherCrossword === null) {
      return 0;
    }

    if (aCrossword !== null && anotherCrossword === null) {
      return -1;
    }

    if (aCrossword === null && anotherCrossword !== null) {
      return 1;
    }

    const a_val = aCrossword.x * aCrossword.y;
    const another_val = anotherCrossword.x * anotherCrossword.y;

    if (a_val === another_val) {
      return 0;
    }

    return a_val < another_val ? -1 : 1;
  }
}