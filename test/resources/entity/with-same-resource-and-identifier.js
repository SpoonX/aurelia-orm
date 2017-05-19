import {endpoint} from '../../../src/decorator/endpoint';
import {identifier} from '../../../src/decorator/identifier';
import {resource} from '../../../src/decorator/resource';
import {Entity} from '../../../src/entity';

@identifier('with-identifier-foo')
@resource('with-duplicated-resource')
@endpoint('with-endpoint-foo')
export class FirstWithSameResourceAndIdentifier extends Entity {
  foo = null;
}


@identifier('with-identifier-bar')
@resource('with-duplicated-resource')
@endpoint('with-endpoint-bar')
export class SecondWithSameResourceAndIdentifier extends Entity {
  foo = null;
}

