import {Crossword} from "../lib/crossword.js";

test('crosswords constructor sets properties', () => {
  const a_crossword = new Crossword(1, 2, []);

  expect(a_crossword.x).toEqual(1);
  expect(a_crossword.y).toEqual(2);
  expect(a_crossword.words).toEqual([]);
});

test('compare returns expected results', () => {
  const good_crossword = new Crossword(10, 10, []);
  const not_that_good_crossword = new Crossword(10, 12, []);

  expect(Crossword.compare(null, good_crossword)).toEqual(1);
  expect(Crossword.compare(good_crossword, null)).toEqual(-1);
  expect(Crossword.compare(null, null)).toEqual(0);
  expect(Crossword.compare(good_crossword, not_that_good_crossword)).toEqual(-1);
  expect(Crossword.compare(not_that_good_crossword, good_crossword)).toEqual(1);
  expect(Crossword.compare(good_crossword, good_crossword)).toEqual(0);
});