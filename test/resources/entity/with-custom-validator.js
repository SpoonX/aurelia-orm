import {validatedResource} from '../../../src/decorator/validated-resource';
import {Entity} from '../../../src/entity';
import {ValidationRules, StandardValidator} from 'aurelia-validation';

export class CustomValidator extends StandardValidator {}

@validatedResource(null, CustomValidator)
export class WithCustomValidator extends Entity {
  foo = null;

  constructor() {
    super();
    ValidationRules
      .ensure('foo').required().minLength(3).maxLength(20)
      .on(this);
  }
}
