import {Entity} from '../../../src/entity';
import {resource} from '../../../src/decorator/resource';
import {endpoint} from '../../../src/decorator/endpoint';

@resource()
@endpoint('sx/alternative')
export class WithEndpoint extends Entity {

}
