import {validatedResource} from '../../../src/decorator/validated-resource';
import {Entity} from '../../../src/entity';

@validatedResource('holy-cow')
export class WithValidatedCustomResource extends Entity {
}
