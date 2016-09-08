import {validatedResource} from '../../../src/decorator/validated-resource';
import {Entity} from '../../../src/entity';
import {ValidationRules, StandardValidator} from 'aurelia-validation';
import {inject} from 'aurelia-dependency-injection';

export class CustomValidator extends StandardValidator {}

@validatedResource()
@inject(CustomValidator)
export class WithCustomValidator extends Entity {
  foo = null;

  constructor(validator) {
    super();

    this.setValidator(validator);

    ValidationRules
      .ensure('foo').required().minLength(3).maxLength(20)
      .on(this);
  }
}
