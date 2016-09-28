import {validatedResource} from '../../../src/decorator/validated-resource';
import {Entity} from '../../../src/entity';
import {ValidationRules} from 'aurelia-validation';

@validatedResource()
export class WithValidation extends Entity {
  foo = null;

  bar = null;

  constructor() {
    super();

    ValidationRules
      .ensure('foo').required().minLength(10).maxLength(20)
      .on(this);
  }
}
