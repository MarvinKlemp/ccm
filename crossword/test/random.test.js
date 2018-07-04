import {MathRandom} from "../lib/random.js";

test('between produces interval in format [min..max) ', () => {
  const random = new MathRandom();

  for (let i = 0; i <= 100; i++) {
    let result = random.between(0, 2);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(2);
  }
});

test('between random sequence produces interval in format [0..length) ', () => {
  const random = new MathRandom();
  const tmp = [
    false, false, false, false, false,
    false, false, false, false, false
  ];

  const sequence = random.random_sequence(10);
  for (let i of sequence) {
    tmp[i] = true;
  }

  for (let check of tmp) {
    expect(check).toBeTruthy();
  }
});