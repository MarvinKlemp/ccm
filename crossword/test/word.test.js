import {WordInput} from "../lib/main.js";
import {Word} from "../lib/word.js";

test('Word constructor sets properties correctly', () => {
  const a_word = new Word("word", "question", 10, 11, true);

  expect(a_word.word).toEqual("word");
  expect(a_word.question).toEqual("question");
  expect(a_word.x).toEqual(10);
  expect(a_word.y).toEqual(11);
  expect(a_word.orientation).toEqual(true);
});

test('Word auxiliary constructor sets properties correctly', () => {
  const word_input = new WordInput("word", "question");
  const a_word = Word.fromWordInput(word_input, 10, 11, true);

  expect(a_word.word).toEqual("word");
  expect(a_word.question).toEqual("question");
  expect(a_word.x).toEqual(10);
  expect(a_word.y).toEqual(11);
  expect(a_word.orientation).toEqual(true);
});