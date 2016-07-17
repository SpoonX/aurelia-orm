import {resource} from '../../../src/decorator/resource';
import {type} from '../../../src/decorator/type';
import {Entity} from '../../../src/entity';

@resource('with-type')
export class WithType extends Entity {
  @type('datetime')
  created = null;

  @type('boolean')
  disabled = null;

  @type('integer')
  age = null;

  @type('float')
  titanic = null;
}
