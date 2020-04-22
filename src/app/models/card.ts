import {Family} from './family';

export default class Card {
  number: number;
  family: Family;
  isPlayable: boolean;
  newOne = false;
  toGive = false;
  played = false;

  constructor(nb: number, family: Family, isPlayable = false, newOne = false, toGive = false) {
    this.number = nb;
    this.family = family;
    this.isPlayable = isPlayable;
    this.newOne = newOne;
    this.toGive = toGive;
  }
}
