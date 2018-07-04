import { MathRandom } from "./random.js";

import { Matrix } from "./matrix.js";
import { Crossword } from "./crossword.js";

export class WordInput {

  constructor(word, question) {
    this.word = word;
    this.question = question;
  }
}

const HORIZONTAL = true;
const VERTICAL = false;

export class TrialAndErrorCrosswordGenerator {

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