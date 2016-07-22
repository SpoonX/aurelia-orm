import {Entity} from '../../../src/entity';
import {resource} from '../../../src/decorator/resource';
import {name} from '../../../src/decorator/name';

@resource()
@name('cool name')
export class WithName extends Entity {

}
