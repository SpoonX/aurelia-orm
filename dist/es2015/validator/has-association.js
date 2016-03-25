import { ValidationRule } from 'aurelia-validation';
import { Entity } from '../aurelia-orm';

export let HasAssociationValidationRule = class HasAssociationValidationRule extends ValidationRule {
  constructor() {
    super(null, value => !!(value instanceof Entity && typeof value.id === 'number' || typeof value === 'number'), null, 'isRequired');
  }
};