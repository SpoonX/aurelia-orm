import {Entity} from '../../../src/entity';
import {resource, name} from '../../../src/aurelia-orm';

@resource()
@name('cool name')
export class WithName extends Entity {

}
