import {validatedResource} from '../../../src/decorator/validated-resource';
import {Entity} from '../../../src/entity';

@validatedResource()
export class WithValidation extends Entity {

  //@ensure(it => it.isNotEmpty().hasLengthBetween(3, 20))
  foo = null;
}
