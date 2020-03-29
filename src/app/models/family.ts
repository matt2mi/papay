export class Family {
  id: number;
  label: string;

  constructor(id: number, label: string) {
    this.id = id;
    this.label = label;
  }
}

export enum FamilyEnum {
  'Pique' = 0,
  'Coeur' = 1,
  'Carreau' = 2,
  'Trefle' = 3,
  'Papayoo' = 4
}

export const FAMILIES: Family[] = [
  new Family(0, FamilyEnum[0]),
  new Family(1, FamilyEnum[1]),
  new Family(2, FamilyEnum[2]),
  new Family(3, FamilyEnum[3]),
  new Family(4, FamilyEnum[4]),
];
