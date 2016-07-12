import {resource} from '../../../src/decorator/resource';
import {idProperty} from '../../../src/decorator/idProperty';
import {Entity} from '../../../src/entity';

@resource('with-resource')
@idProperty('idTag')
export class WithResource extends Entity {
  foo = null;
}
