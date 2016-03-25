import {Entity} from '../../../src/entity';
import {resource, endpoint} from '../../../src/aurelia-orm';

@resource()
@endpoint('sx/alternative')
export class WithEndpoint extends Entity {

}
