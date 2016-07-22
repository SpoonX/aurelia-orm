import {ValidationRule} from 'aurelia-validation';
import {Entity} from '../entity';

export class HasAssociationValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      value => !!((value instanceof Entity && typeof value.id === 'number') || typeof value === 'number'),
      null,
      'isRequired'
    );
  }
}
