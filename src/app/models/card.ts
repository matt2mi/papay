import {Family} from './family';

export default class Card {
  number: number;
  family: Family;
  isPlayable: boolean;
  newOne: boolean = false;
  toGive: boolean = false;

  constructor(nb: number, family: Family, isPlayable = false) {
    this.number = nb;
    this.family = family;
    this.isPlayable = isPlayable;
  }
}
