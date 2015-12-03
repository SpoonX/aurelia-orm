import {repository, resource} from '../../../src/index';
import {Entity} from '../../../src/entity';
import {SimpleCustom} from '../repository/simple-custom';

@resource()
@repository(SimpleCustom)
export class WithCustomRepository extends Entity {
}
