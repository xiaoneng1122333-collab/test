import { Card, Suit, CardValue } from './types';
import { PlayingCard } from './card';

export class Deck {
  private cards: Card[] = [];
  private suits: Suit[] = ['♠', '♥', '♦', '♣'];
  private values: CardValue[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  constructor() {
    this.initializeDeck();
  }

  private initializeDeck(): void {
    this.cards = [];
    for (const suit of this.suits) {
      for (const value of this.values) {
        this.cards.push(new PlayingCard(suit, value));
      }
    }
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard(): Card | undefined {
    return this.cards.pop();
  }

  drawCards(count: number): Card[] {
    const drawnCards: Card[] = [];
    for (let i = 0; i < count && this.cards.length > 0; i++) {
      const card = this.drawCard();
      if (card) drawnCards.push(card);
    }
    return drawnCards;
  }

  get remainingCards(): number {
    return this.cards.length;
  }

  reset(): void {
    this.initializeDeck();
    this.shuffle();
  }
}