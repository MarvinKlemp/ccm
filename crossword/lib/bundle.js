class MathRandom {
  direction() {
    return Math.random() >= 0.5;
  }

  between(min, max) {
    return Math.floor(Math.random() * max) + min;
  }

  random_sequence(length) {
    let numbers = [...Array(length).keys()];

    let j, x, i;

    for (i = numbers.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = numbers[i];
      numbers[i] = numbers[j];
      numbers[j] = x;
    }

    return numbers;
  }
}

class Word {

  constructor(word, question, x, y, orientation) {
    this.word = word;
    this.question = question;
    this.x = x;
    this.y = y;
    this.orientation = orientation;
  }

  static fromWordInput(word, x, y, orientation) {
    return new Word(word.word, word.question, x, y, orientation);
  }
}

class Crossword {

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

class Tile {

  constructor(x, y, letter) {
    this.x = x;
    this.y = y;
    this.letter = letter;
  }
}

class Matrix {

  constructor(X, Y, matrix = null, tiles = null, entries = null) {
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
    this.tiles = tiles === null ? [] : tiles;
    this.entries = entries === null ? [] : entries;
  }

  addWord(word_input, startX, startY, orientation) {
    const word_string = word_input.word;
    const start_i = orientation ? startX : startY;

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

  positions_of_char(char) {
    let positions = [];
    for (let tile of this.tiles) {
      if (tile.letter === char) {
        positions.push(tile);
      }
    }

    return positions;
  }

  _validateCellIsNotNull(y, x) {
    return this.matrix[y][x] !== null;
  }

  validate_position(word_string, startX, startY, orientation) {
    // check bounds
    if (startY < 0 || startY >= this.matrix.length || startX < 0 || startX >= this.matrix[startY].length) return false;

    const start_i = orientation ? startX : startY;

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
      let value = orientation ? this.matrix[startY][i] : this.matrix[i][startX];

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
      if (this._validateCellIsNotNull(startY - 1, startX)) {
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
      let value = orientation ? this.matrix[startY][i] : this.matrix[i][startX];

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
        if (this._validateCellIsNotNull(startY + 1, i) || this._validateCellIsNotNull(startY - 1, i)) {
          surrounded_iteration = true;
        } else {
          surrounded_iteration = false;
        }
      } else {
        if (this._validateCellIsNotNull(i, startX + 1) || this._validateCellIsNotNull(i, startX - 1)) {
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

  to_crossword() {
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

    return new Crossword(rightOffset - leftOffset + 1, bottomOffset - topOffset + 1, normalized);
  }
}

class WordInput {

  constructor(word, question) {
    this.word = word;
    this.question = question;
  }
}

const HORIZONTAL = true;
const VERTICAL = false;

class TrialAndErrorCrosswordGenerator {

  constructor(random = null) {
    if (random === null) {
      random = new MathRandom();
    }

    this.random = random;
  }

  generate(words, context, N = 1) {
    if (words.length < 1) {
      return null;
    }

    words.sort(function (a, b) {
      return b.word.length - a.word.length;
    });

    let result = null;
    for (let i = 0; i < N; i++) {
      let run = this._generate_crossword(words, context);

      if (run === null) {
        continue;
      }

      if (result === null || Crossword.compare(run, result) <= 0) {
        result = run;
      }
    }

    return result;
  }

  _generate_crossword(words, context) {
    const matrix = new Matrix(context.hasOwnProperty('X') ? context.X : 100, context.hasOwnProperty('Y') ? context.Y : 100);

    let first = words[0];
    matrix.addWord(first, matrix.X / 2, matrix.Y / 2, this.random.direction());

    let missing_words = words.slice(0);
    missing_words.splice(0, 1);

    while (true) {
      let word_found_in_iteration = false;

      for (let word_idx = 0; word_idx < missing_words.length; word_idx++) {
        let word_input = missing_words[word_idx];

        let position = this._find_position(matrix, word_input.word);

        if (position !== null && position !== undefined) {
          matrix.addWord(word_input, position.x, position.y, position.orientation);
          missing_words.splice(word_idx, 1);
          word_found_in_iteration = true;
        }
      }

      if (!word_found_in_iteration) {
        return null;
      }

      if (missing_words.length === 0) {
        break;
      }
    }

    return matrix.to_crossword();
  }

  _find_position(matrix, word_string) {
    let results = [];

    for (let char_idx in word_string) {
      let positions = matrix.positions_of_char(word_string[char_idx]);

      for (let position of positions) {
        let horizontal = matrix.validate_position(word_string, position.x - char_idx, position.y, HORIZONTAL);
        let vertical = matrix.validate_position(word_string, position.x, position.y - char_idx, VERTICAL);

        if (horizontal) {
          results.push(new PositionResult(position.x - char_idx, position.y, HORIZONTAL));
        }

        if (vertical) {
          results.push(new PositionResult(position.x, position.y - char_idx, VERTICAL));
        }
      }
    }

    if (results.length === 0) {
      return null;
    }

    return results[this.random.between(0, results.length)];
  }
}

class PositionResult {

  constructor(x, y, orientation) {
    this.x = x;
    this.y = y;
    this.orientation = orientation;
  }
}

export { WordInput, TrialAndErrorCrosswordGenerator };
