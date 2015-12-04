import {resource} from '../../../src/decorator/resource';
import {Entity} from '../../../src/entity';

@resource('with-resource')
export class WithResource extends Entity {
  foo = null;
}
