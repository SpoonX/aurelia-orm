import {endpoint} from '../../../src/decorator/endpoint';
import {identifier} from '../../../src/decorator/identifier';
import {resource} from '../../../src/decorator/resource';
import {Entity} from '../../../src/entity';

@resource('with-duplicated-resource')
@endpoint('with-endpoint-foo')
export class FirstWithSameResource extends Entity {
  foo = null;
}


@resource('with-duplicated-resource')
@endpoint('with-endpoint-bar')
export class SecondWithSameResource extends Entity {
  foo = null;
}

