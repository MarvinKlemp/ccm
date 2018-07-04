import {TrialAndErrorCrosswordGenerator} from "../lib/main.js";
import {WordInput} from "../lib/main.js";
import {MathRandom} from "../lib/random.js";

/**
 * Used to stub randomness in tests
 */
class StubbedRandom {
  direction() {
    return true;
  }

  between(min, max) {
    return 0
  }

  random_sequence(length) {
    return [...Array(length).keys()];
  }
}

/**
 * WordInput
 */
test('WordInput constructor sets properties correctly', () => {
  const a_word = new WordInput("word", "question");

  expect(a_word.word).toEqual("word");
  expect(a_word.question).toEqual("question");
});

/**
 * TrialAndErrorCrosswordGenerator
 */

test('Generator constructor sets properties correctly', () => {
  let generator = new TrialAndErrorCrosswordGenerator();
  expect(generator.random).toEqual(new MathRandom());

  const random = new StubbedRandom();
  generator = new TrialAndErrorCrosswordGenerator(random);
  expect(generator.random).toBe(random);
});

test('Generator returns null if less than one word is passed', () => {
  const generator = new TrialAndErrorCrosswordGenerator();

  expect(generator.generate([])).toEqual(null);
});

test('Generator returns null if in a iteration no word was found', () => {
  const generator = new TrialAndErrorCrosswordGenerator();

  expect(generator._generate_crossword([
    new WordInput("tiger", "q1"),
    new WordInput("cook", "q2"),
    new WordInput("bear", "q3")
  ], {})).toEqual(null);
});

test('Generator returns successfully created crossword', () => {
  const generator = new TrialAndErrorCrosswordGenerator(new StubbedRandom());

  let result = generator.generate([
    new WordInput("tiger", "q1"),
    new WordInput("bear", "q2"),
    new WordInput("cat", "q3")
  ], {}, 1);

  const expected = {"words": [{"orientation": true, "question": "q1", "word": "tiger", "x": 0, "y": 2}, {"orientation": false, "question": "q2", "word": "bear", "x": 3, "y": 1}, {"orientation": false, "question": "q3", "word": "cat", "x": 0, "y": 0}], "x": 5, "y": 5};
  expect(result).toEqual(expected);
});

test('Generator returns test example successfully', () => {
  const generator = new TrialAndErrorCrosswordGenerator();

  const expected_words = [
    "DISCOUNT", "SUPPLIER", "WHOLESALER", "MANUFACTURER", "DURABLE", "B2B", "OPERATOR", "SERVICE",
    "MARKETPLACE", "ACQUISITION", "CONSUMER", "GOOD", "WITHDRAW", "INNOVATION", "RETAIL", "UNIONS",
    "CONVENIENCE", "SUPERMARKET", "COMPETITOR", "GUARANTEE", "SERENDIPITY", "WAREHOUSE"
  ].sort();

  const result = generator.generate([
    new WordInput("DISCOUNT", "discount"),
    new WordInput("SUPPLIER", "supplier"),
    new WordInput("WHOLESALER", "wholesaler"),
    new WordInput("MANUFACTURER", "manufacturer"),
    new WordInput("DURABLE", "durable"),
    new WordInput("B2B", "b2b"),
    new WordInput("OPERATOR", "operator"),
    new WordInput("SERVICE", "service"),
    new WordInput("MARKETPLACE", "marketplace"),
    new WordInput("ACQUISITION", "acquisition"),
    new WordInput("CONSUMER", "consumer"),
    new WordInput("GOOD", "good"),
    new WordInput("WITHDRAW", "withdraw"),
    new WordInput("INNOVATION", "innovation"),
    new WordInput("RETAIL", "retail"),
    new WordInput("UNIONS", "unions"),
    new WordInput("CONVENIENCE", "convenience"),
    new WordInput("SUPERMARKET", "supermarket"),
    new WordInput("COMPETITOR", "competitor"),
    new WordInput("GUARANTEE", "guarantee"),
    new WordInput("SERENDIPITY", "serendipity"),
    new WordInput("WAREHOUSE", "warehouse")
  ], {X: 200, Y: 200}, 10);

  expect(result).not.toBeNull();

  const used_words = result.words.map(word_output => {return word_output.word}).sort();
  expect(used_words.length).toEqual(expected_words.length);
  expect(used_words).toEqual(expected_words);
});

