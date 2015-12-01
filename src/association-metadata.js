export class AssociationMetaData {
  static key = 'orm:entity:associations';

  constructor () {
    this.associations = {};
  }

  add (association, reference) {
    this.associations[association] = reference;
  }

  has (reference) {
    return typeof this.associations[reference] !== 'undefined';
  }

  fetch (association) {
    return this.associations[association];
  }
}
