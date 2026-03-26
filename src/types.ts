export type Suit = '♠' | '♥' | '♦' | '♣';
export type CardValue = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  value: CardValue;
}

export interface Player {
  name: string;
  hand: Card[];
  balance: number;
}

export interface GameState {
  deck: Card[];
  player: Player;
  dealer: Player;
  currentBet: number;
  gameInProgress: boolean;
  message: string;
}