import { Card, Suit, CardValue } from './types';

export class PlayingCard implements Card {
  constructor(public suit: Suit, public value: CardValue) {}

  get displayValue(): string {
    return `${this.value}${this.suit}`;
  }

  get numericValue(): number {
    switch (this.value) {
      case 'A': return 11;
      case 'K':
      case 'Q':
      case 'J': return 10;
      default: return parseInt(this.value);
    }
  }

  isRed(): boolean {
    return this.suit === '♥' || this.suit === '♦';
  }
}