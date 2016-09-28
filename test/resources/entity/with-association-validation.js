import {validatedResource} from '../../../src/decorator/validated-resource';
import {association} from '../../../src/decorator/association';
import {Entity} from '../../../src/entity';
import {ValidationRules} from 'aurelia-validation';

@validatedResource('assoc-validation')
export class WithAssociationValidation extends Entity {
  @association()
  foo = null;

  @association('custom')
  bar = null;

  constructor() {
    super();

    ValidationRules
      .ensure('foo').satisfiesRule('hasAssociation')
      .on(this);
  }
}
