export class Word {

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