import {resource} from '../../../src/decorator/resource';
import {repository} from '../../../src/decorator/repository';
import {Entity} from '../../../src/entity';
import {SimpleCustom} from '../repository/simple-custom';

@resource()
@repository(SimpleCustom)
export class WithCustomRepository extends Entity {
}
