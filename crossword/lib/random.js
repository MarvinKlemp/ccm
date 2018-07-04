

export class MathRandom {
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