import {resource} from '../../../src/decorator/resource';
import {enumeration} from '../../../src/decorator/enumeration';
import {Entity} from '../../../src/entity';

@resource('with-enumeration')
export class WithEnumeration extends Entity {
  @enumeration(['starting', 'started', 'running', 'complete'])
  state = null;
}
