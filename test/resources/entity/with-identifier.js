import {identifier} from '../../../src/decorator/identifier';
import {resource} from '../../../src/decorator/resource';
import {idProperty} from '../../../src/decorator/idProperty';
import {Entity} from '../../../src/entity';

@identifier('with-identifier')
@resource('with-resource')
@idProperty('idTag')
export class WithIdentifier extends Entity {
  foo = null;
}
