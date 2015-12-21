import {EntityManager} from './entity-manager';
import {ValidationGroup} from 'aurelia-validation';
import {HasAssociationValidationRule} from './validator/has-association';

export {DefaultRepository} from './default-repository';
export {Repository} from './repository';
export {Entity} from './entity';
export {OrmMetadata} from './orm-metadata';
export {EntityManager} from './entity-manager';
export {association} from './decorator/association';
export {resource} from './decorator/resource';
export {repository} from './decorator/repository';
export {validation} from './decorator/validation';
export {validatedResource} from './decorator/validated-resource';

export function configure(aurelia, configCallback) {
  let entityManagerInstance = aurelia.container.get(EntityManager);

  configCallback(entityManagerInstance);

  ValidationGroup.prototype.hasAssociation = function() {
    return this.isNotEmpty().passesRule(new HasAssociationValidationRule());
  };
}
