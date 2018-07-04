import {WordInput} from "../lib/main.js";
import {Matrix, Tile} from "../lib/matrix.js";
import {Word} from "../lib/word.js";

test('Tile constructor sets properties correctly', () => {
  const tile = new Tile(10, 11, "A");

  expect(tile.x).toEqual(10);
  expect(tile.y).toEqual(11);
  expect(tile.letter).toEqual("A");
});

test('Matrix constructor sets properties correctly', () => {
  const matrix = new Matrix(50, 50);

  expect(matrix.X).toEqual(50);
  expect(matrix.Y).toEqual(50);
  expect(matrix.matrix.length).toEqual(50);
  expect(matrix.matrix[0].length).toEqual(50);
  expect(matrix.entries).toEqual([]);
  expect(matrix.tiles).toEqual([]);
});

test('Matrix add word adds word correctly in matrix, entries and tiles', () => {
  const matrix = new Matrix(100, 100);
  let word_string = "marketplace";
  let question_string = "where can you buy goods?";
  let word_input = new WordInput(word_string, question_string);
  let X = 50;
  let Y = 50;

  matrix.addWord(word_input, X, Y, true);

  for (let x = 50; x < 50 + word_string.length; x++) {
    expect(matrix.matrix[50][x]).toEqual(word_string[x - 50]);
  }
  expect(matrix.entries.length).toEqual(1);
  expect(matrix.entries[0]).toEqual(new Word(word_string, question_string, 50, 50, true));
  const expected_tiles = [
    new Tile(50, 50, "m"),
    new Tile(51, 50, "a"),
    new Tile(52, 50, "r"),
    new Tile(53, 50, "k"),
    new Tile(54, 50, "e"),
    new Tile(55, 50, "t"),
    new Tile(56, 50, "p"),
    new Tile(57, 50, "l"),
    new Tile(58, 50, "a"),
    new Tile(59, 50, "c"),
    new Tile(60, 50, "e")
  ];
  expect(matrix.tiles.length).toEqual(11);
  for (let i = 0; i < expected_tiles.length; i++) {
    expect(matrix.tiles[i]).toEqual(expected_tiles[i]);
  }

  // customer
  word_string = "customer";
  question_string = "who buys goods?";
  word_input = new WordInput(word_string, question_string);
  X = 55;
  Y = 50;

  matrix.addWord(word_input, X, Y -
    3, false);

  for (let y = 47; y < 47 + word_string.length; y++) {
    expect(matrix.matrix[y][X]).toEqual(word_string[y - 47]);
  }
  expect(matrix.entries.length).toEqual(2);
  expect(matrix.entries[1]).toEqual(new Word(word_string, question_string, 55, 47, false));
  expected_tiles.push(new Tile(55, 47, "c"));
  expected_tiles.push(new Tile(55, 48, "u"));
  expected_tiles.push(new Tile(55, 49, "s"));
  expected_tiles.push(new Tile(55, 50, "t"));
  expected_tiles.push(new Tile(55, 51, "o"));
  expected_tiles.push(new Tile(55, 52, "m"));
  expected_tiles.push(new Tile(55, 53, "e"));
  expected_tiles.push(new Tile(55, 54, "r"));
  expect(matrix.tiles.length).toEqual(11 + 8);
  for (let i = 0; i < expected_tiles.length; i++) {
    expect(matrix.tiles[i]).toEqual(expected_tiles[i]);
  }
});

test('Matrix positions of char returns all tiles with the char', () => {

  let a = new Tile(50, 51, "A");
  let b = new Tile(50, 52, "B");
  let c = new Tile(50, 53, "A");

  const tiles = [a, b, c];
  const matrix = new Matrix(100, 100, null, tiles, null);

  let result = matrix.positions_of_char("A");
  expect(result.length).toBe(2);
  expect(result[0]).toBe(a);
  expect(result[1]).toBe(c);

  result = matrix.positions_of_char("B");
  expect(result.length).toBe(1);
  expect(result[0]).toBe(b);

  result = matrix.positions_of_char("C");
  expect(result.length).toBe(0);
});


test('_validateCellIsNotNull checks correctly if a cell is not null', () => {
  const mat = [];
  for (let i = 0; i < 10; i++) {
    mat[i] = [];
    for (let j = 0; j < 10; j++) {
      mat[i][j] = null;
    }
  }
  mat[5][5] = "A";

  const matrix = new Matrix(10, 10, mat, null, null);

  expect(matrix._validateCellIsNotNull(0,0)).toBeFalsy();
  expect(matrix._validateCellIsNotNull(5,5)).toBeTruthy();
});


test('validate_position checks if word start is out of border', () => {
  const mat = [];
  for (let i = 0; i < 3; i++) {
    mat[i] = [];
    for (let j = 0; j < 3; j++) {
      mat[i][j] = null;
    }
  }

  const matrix = new Matrix(3, 3, mat, null, null);

  expect(matrix.validate_position("border", -1, 0, true)).toBeFalsy();
  expect(matrix.validate_position("border", 0, -1, true)).toBeFalsy();
  expect(matrix.validate_position("border", 4, 0, false)).toBeFalsy();
  expect(matrix.validate_position("border", 0, 4, false)).toBeFalsy();
});

test('validate_position checks if a word runs out of border', () => {
  const mat = [];
  for (let i = 0; i < 3; i++) {
    mat[i] = [];
    for (let j = 0; j < 3; j++) {
      mat[i][j] = null;
    }
  }

  const matrix = new Matrix(3, 3, mat, null, null);

  expect(matrix.validate_position("border", 0, 0, true)).toBeFalsy();
  expect(matrix.validate_position("border", 0, 0, false)).toBeFalsy();
});

test('validate_position checks if a word is within another word and returns false', () => {
  const mat = [];
  for (let i = 0; i < 100; i++) {
    mat[i] = [];
    for (let j = 0; j < 100; j++) {
      mat[i][j] = null;
    }
  }
  mat[50][50] = "c";
  mat[50][51] = "a";
  mat[50][52] = "r";
  mat[50][53] = "s";
  mat[50][54] = "h";
  mat[50][55] = "a";
  mat[50][56] = "r";
  mat[50][57] = "i";
  mat[50][58] = "n";
  mat[50][59] = "g";

  const matrix = new Matrix(100, 100, mat, null, null);

  expect(matrix.validate_position("car", 50, 50, true)).toBeFalsy();
  expect(matrix.validate_position("car", 50, 50, false)).toBeTruthy();
});

test('validate_position checks if word borders another word at the start horizontally and returns false', () => {
  const mat = [];
  for (let i = 0; i < 100; i++) {
    mat[i] = [];
    for (let j = 0; j < 100; j++) {
      mat[i][j] = null;
    }
  }

  mat[50][50] = "w";
  mat[51][50] = "o";
  mat[52][50] = "r";
  mat[53][50] = "d";

  mat[53][48] = "d";
  mat[53][49] = "a";
  mat[53][50] = "d";

  const matrix = new Matrix(100, 100, mat, null, null);
  expect(matrix.validate_position("day", 50, 53, true)).toBeFalsy();
});

test('validate_position checks if a word borders another word at the start vertically and returns false', () => {
  const mat = [];
  for (let i = 0; i < 100; i++) {
    mat[i] = [];
    for (let j = 0; j < 100; j++) {
      mat[i][j] = null;
    }
  }

  mat[50][50] = "w";
  mat[50][51] = "o";
  mat[50][52] = "r";
  mat[50][53] = "d";

  mat[48][53] = "d";
  mat[49][53] = "a";
  mat[50][53] = "d";

  /**
   *    w
   *    o
   *    r
   *  daday
   */

  const matrix = new Matrix(100, 100, mat, null, null);
  expect(matrix.validate_position("day", 53, 50, false)).toBeFalsy();
});

test('validate_position checks if a word borders another word at the end horizontally and returns false', () => {
  const mat = [];
  for (let i = 0; i < 100; i++) {
    mat[i] = [];
    for (let j = 0; j < 100; j++) {
      mat[i][j] = null;
    }
  }

  mat[50][50] = "w";
  mat[51][50] = "o";
  mat[52][50] = "r";
  mat[53][50] = "d";

  mat[53][50] = "d";
  mat[53][51] = "a";
  mat[53][52] = "d";

  /**
   *    w
   *    o
   *    r
   *  endad
   */

  const matrix = new Matrix(100, 100, mat, null, null);
  expect(matrix.validate_position("end", 48, 53, true)).toBeFalsy();
});

test('validate_position checks if a word borders another word at the end vertically and returns false', () => {
  const mat = [];
  for (let i = 0; i < 100; i++) {
    mat[i] = [];
    for (let j = 0; j < 100; j++) {
      mat[i][j] = null;
    }
  }

  mat[50][50] = "w";
  mat[50][51] = "o";
  mat[50][52] = "r";
  mat[50][53] = "d";

  mat[50][53] = "d";
  mat[51][53] = "a";
  mat[52][53] = "d";

  /**
   *    e
   *    n
   * word
   *    a
   *    d
   */

  const matrix = new Matrix(100, 100, mat, null, null);
  expect(matrix.validate_position("end", 53, 48, false)).toBeFalsy();
});

test('validate_position checks if a word is surrounded with another word and returns false', () => {
  const mat = [];
  for (let i = 0; i < 100; i++) {
    mat[i] = [];
    for (let j = 0; j < 100; j++) {
      mat[i][j] = null;
    }
  }

  mat[50][50] = "w";
  mat[50][51] = "r";
  mat[50][52] = "o";
  mat[50][53] = "n";
  mat[50][54] = "g";

  mat[50][50] = "w";
  mat[51][50] = "o";
  mat[52][50] = "r";
  mat[53][50] = "d";

  mat[50][54] = "g";
  mat[51][54] = "y";
  mat[52][54] = "m";

  //    wrong
  //    o   y
  //    r   m
  //    daily ->  would be wrong as there it would break the word gym.

  const matrix = new Matrix(100, 100, mat, null, null);
  expect(matrix.validate_position("daily", 0, 50, 53, true)).toBeFalsy();
});

test('validate_position returns false on wrong letter intersections', () => {
  const mat = [];
  for (let i = 0; i < 100; i++) {
    mat[i] = [];
    for (let j = 0; j < 100; j++) {
      mat[i][j] = null;
    }
  }

  mat[50][50] = "t";
  mat[50][51] = "r";
  mat[50][52] = "u";
  mat[50][53] = "e";

  const matrix = new Matrix(100, 100, mat, null, null);
  expect(matrix.validate_position("wrong", 50, 48, false)).toBeFalsy();
});

test('validate_position returns true without validation errors', () => {
  const mat = [];
  for (let i = 0; i < 100; i++) {
    mat[i] = [];
    for (let j = 0; j < 100; j++) {
      mat[i][j] = null;
    }
  }

  mat[50][50] = "t";
  mat[50][51] = "r";
  mat[50][52] = "u";
  mat[50][53] = "e";

  const matrix = new Matrix(100, 100, mat, null, null);
  expect(matrix.validate_position("end", 53, 50, false)).toBeTruthy();
});

test('to_crossword returns the expected result', () => {
  const mat = [];
  for (let i = 0; i < 100; i++) {
    mat[i] = [];
    for (let j = 0; j < 100; j++) {
      mat[i][j] = null;
    }
  }

  mat[50][50] = "t";
  mat[50][51] = "r";
  mat[50][52] = "u";
  mat[50][53] = "e";

  mat[49][53] = "r";
  mat[50][51] = "e";
  mat[51][51] = "s";
  mat[52][51] = "u";
  mat[53][51] = "l";
  mat[54][51] = "t";

  const tiles = [
    new Tile(50, 50, "t"),
    new Tile(51, 50, "r"),
    new Tile(52, 50, "u"),
    new Tile(53, 50, "e"),
    new Tile(53, 49, "r"),
    new Tile(53, 50, "e"),
    new Tile(53, 51, "s"),
    new Tile(53, 52, "u"),
    new Tile(53, 53, "l"),
    new Tile(53, 54, "t"),
  ];
  let entries = [
    new Word("true", "q1", 50, 50, true),
    new Word("result", "q2", 53, 49, false),
  ];

  const matrix = new Matrix(100, 100, mat, tiles, entries);
  let result = matrix.to_crossword();

  expect(result.x).toEqual(4);
  expect(result.y).toEqual(6);
  expect(result.words.length).toEqual(2);
  expect(result.words[0]).toEqual({word: "true", question: "q1", x: 0, y: 1, orientation: true});
  expect(result.words[1]).toEqual({word: "result", question: "q2", x: 3, y: 0, orientation: false});
});