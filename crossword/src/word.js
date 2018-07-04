export class Word {
  x: number;
  y: number;
  orientation: boolean;
  word: string;
  question: string;

  constructor(word: string, question: string, x: number, y: number, orientation: boolean) {
    this.word = word;
    this.question = question;
    this.x = x;
    this.y = y;
    this.orientation = orientation;
  }

  static fromWordInput(word: WordInput, x: number, y: number, orientation: boolean): Word {
    return new Word(
      word.word, word.question, x, y, orientation
    );
  }
}