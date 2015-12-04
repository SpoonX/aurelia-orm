import {validatedResource} from '../../../src/decorator/validated-resource';
import {Entity} from '../../../src/entity';

@validatedResource()
export class WithValidatedResource extends Entity {
}
