import {Family} from './family';

export default class Card {
  number: number;
  family: Family;

  constructor(nb: number, family: Family) {
    this.number = nb;
    this.family = family;
  }
}
