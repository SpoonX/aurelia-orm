import {association} from '../../../src/decorator/association';
import {resource} from '../../../src/decorator/resource';
import {Entity} from '../../../src/entity';

@resource()
export class WithAssociations extends Entity {
  @association()
  foo = null;

  @association('custom')
  bar = null;
}
