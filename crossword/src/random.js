// @flow

export interface Random {
  direction(): boolean;

  between(min: number, max: number): number;

  random_sequence(length: number): Array<number>;
}

export class MathRandom implements Random {
  direction(): boolean {
    return Math.random() >= 0.5;
  }

  between(min: number, max: number): number {
    return Math.floor(Math.random() * max) + min;
  }

  random_sequence(length: number): Array<number> {
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