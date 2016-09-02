import {validatedResource} from '../../../src/decorator/validated-resource';
import {association} from '../../../src/decorator/association';
import {Entity} from '../../../src/entity';

@validatedResource('assoc-validation')
export class WithAssociationValidation extends Entity {

 // @ensure(it => it.hasAssociation())
  @association()
  foo = null;

  @association('custom')
  bar = null;
}
