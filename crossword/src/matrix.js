// @flow

import {Crossword} from "./crossword.js";
import {Word} from "./word.js";
import {WordInput} from "./main.js";

export class Tile {
  y: number;
  x: number;
  letter: string;

  constructor(x: number, y: number, letter: string) {
    this.x = x;
    this.y = y;
    this.letter = letter;
  }
}


export class Matrix {
  X: number;
  Y: number;
  matrix: Array<Array<?string>>;
  tiles: Array<Tile>;
  entries: Array<Word>;

  constructor(
    X: number,
    Y: number,
    matrix: ?Array<Array<?string>> = null,
    tiles: ?Array<Tile> = null,
    entries: ?Array<Word> = null
  ) {
    this.X = X;
    this.Y = Y;

    if (matrix === null) {
      this.matrix = [];
      for (let i = 0; i < Y; i++) {
        this.matrix[i] = [];
        for (let j = 0; j < X; j++) {
          this.matrix[i][j] = null;
        }
      }
    } else {
      this.matrix = matrix;
    }
    this.tiles = (tiles === null) ? [] : tiles;
    this.entries = (entries === null) ? [] : entries;
  }
  
  addWord(word_input: WordInput, startX: number, startY: number, orientation: boolean) {
    const word_string = word_input.word;
    const start_i = (orientation) ? startX : startY;

    for (let i = start_i; i < start_i + word_string.length; i++) {
      if (orientation) {
        this.matrix[startY][i] = word_string[i - start_i];
        this.tiles.push(new Tile(i, startY, word_string[i - start_i]));
      } else {
        this.matrix[i][startX] = word_string[i - start_i];
        this.tiles.push(new Tile(startX, i, word_string[i - start_i]));
      }
    }


    this.entries.push(Word.fromWordInput(word_input, startX, startY, orientation));
  }

  positions_of_char(char: string): Array<Tile> {
    let positions = [];
    for (let tile of this.tiles) {
      if (tile.letter === char) {
        positions.push(tile);
      }
    }

    return positions;
  }

  _validateCellIsNotNull(y: number , x: number): boolean {
    return this.matrix[y][x] !== null;
  }

  validate_position(word_string: string, startX: number, startY: number, orientation: boolean): boolean {
    // check bounds
    if(startY < 0 || startY >= this.matrix.length ||
      startX < 0 || startX >= this.matrix[startY].length
    ) return false;

    const start_i = (orientation) ? startX : startY;

    // check if word is too long for the matrix
    if (orientation) {
      if (startX + word_string.length > this.matrix[startY].length) {
        return false;
      }
    } else {
      if (startY + word_string.length > this.matrix.length) {
        return false;
      }
    }

    // check if word is in another word
    let in_word = true;
    for (let i = start_i; i < start_i + word_string.length; i++) {
      let value = (orientation) ? this.matrix[startY][i] : this.matrix[i][startX];

      if (value === null) {
        in_word = false;
        break;
      }
    }

    if (in_word) {
      return false;
    }

    // check if word is in another word or borders another word
    //
    //    w
    //    o
    //    r
    //  dad
    //
    //    w
    //    o
    //    r
    //  daday

    // check this at the start of the word
    if (orientation) {
      if (this._validateCellIsNotNull(startY, startX - 1)) {
        return false;
      }
    } else {
      if (
        this._validateCellIsNotNull(startY - 1, startX)) {
        return false;
      }
    }

    // check this at the end of the word
    if (orientation) {
      if (this._validateCellIsNotNull(startY, startX + word_string.length)) {
        return false;
      }
    } else {
      if (this._validateCellIsNotNull(startY + word_string.length, startX)) {
        return false;
      }
    }

    // check letters of the word
    for (let i = start_i; i < start_i + word_string.length; i++) {
      let surrounded_iteration = false;
      let value = (orientation) ? this.matrix[startY][i] : this.matrix[i][startX];

      // Check word is surrounded with another word
      //
      //    wrong
      //    o   y
      //    r   m
      //    d

      //
      //    wrong
      //    o   y
      //    r   m
      //    daily ->  would be wrong as there it would break the word gym.

      if (orientation) {
        if (
          this._validateCellIsNotNull(startY + 1, i) ||
          this._validateCellIsNotNull(startY - 1, i)) {
          surrounded_iteration = true;
        } else {
          surrounded_iteration = false;
        }
      } else {
        if (
          this._validateCellIsNotNull(i, startX + 1) ||
          this._validateCellIsNotNull(i, startX - 1)) {
          surrounded_iteration = true;
        } else {
          surrounded_iteration = false;
        }
      }

      if (surrounded_iteration && value === null) {
        return false;
      }
      // if the cell is empty. just skip to the next letter
      if (value == null) {
        continue;
      }

      // if the cell is not empty. It needs to have the same letter as the word on that position
      if (value !== word_string[i - start_i]) {
        return false;
      }
    }

    return true;
  }

  to_crossword(): Crossword {
    let X = this.X - 1;
    let Y = this.Y - 1;

    // top
    let topOffset = 0;
    let topOffsetFound = false;
    for (let y = 0; y < Y; y++) {
      if (topOffsetFound) {
        break;
      }

      for (let x = 0; x < X; x++) {
        if (null !== this.matrix[y][x]) {
          topOffset = y;
          topOffsetFound = true;
          break;
        }
      }
    }

    // left
    let leftOffset = 0;
    let leftOffsetFound = false;
    for (let x = 0; x < X; x++) {
      if (leftOffsetFound) {
        break;
      }

      for (let y = 0; y < Y; y++) {
        if (null !== this.matrix[y][x]) {
          leftOffset = x;
          leftOffsetFound = true;
          break;
        }
      }
    }

    // right
    let rightOffset = 0;
    let rightOffsetFound = false;
    for (let x = X; x >= 0; x--) {
      if (rightOffsetFound) {
        break;
      }

      for (let y = 0; y < Y; y++) {
        if (null !== this.matrix[y][x]) {
          rightOffset = x;
          rightOffsetFound = true;
          break;
        }
      }
    }

    // bottom
    let bottomOffset = 0;
    let bottomOffsetFound = false;
    for (let y = Y; y >= 0; y--) {
      if (bottomOffsetFound) {
        break;
      }

      for (let x = 0; x < X; x++) {
        if (null !== this.matrix[y][x]) {
          bottomOffset = y;
          bottomOffsetFound = true;
          break;
        }
      }
    }

    let normalized = [];
    for (let word of this.entries) {
      normalized.push(new Word(word.word, word.question, word.x - leftOffset, word.y - topOffset, word.orientation));
    }

    return new Crossword (
      (rightOffset - leftOffset) + 1,
      (bottomOffset - topOffset) + 1,
      normalized
    );
  }
}
