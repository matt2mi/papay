const Families = Object.freeze({
  SPADES: {id: 0, label: 'Pique'},
  HEART: {id: 1, label: 'Coeur'},
  DIAMONDS: {id: 2, label: 'Carreau'},
  CHAMROCK: {id: 3, label: 'Trefle'},
  PAPAYOO: {id: 4, label: 'Papayoo'}
});

const getFamilyById = family40Id => {
  switch (family40Id) {
    case 0:
      return Families.SPADES;
    case 1:
      return Families.HEART;
    case 2:
      return Families.DIAMONDS;
    case 3:
      return Families.CHAMROCK;
    case 4:
      return Families.PAPAYOO;
    default:
      return null;
  }
};

module.exports = {Families, getFamilyById};
