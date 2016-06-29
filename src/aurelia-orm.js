import {EntityManager} from './entity-manager';
import {HasAssociationValidationRule} from './validator/has-association';
import {ValidationGroup} from 'aurelia-validation';
import './component/association-select';
import './component/paged';
export {DefaultRepository} from './default-repository';
export {Repository} from './repository';
export {Entity} from './entity';
export {OrmMetadata} from './orm-metadata';
export {association} from './decorator/association';
export {resource} from './decorator/resource';
export {endpoint} from './decorator/endpoint';
export {name} from './decorator/name';
export {repository} from './decorator/repository';
export {validation} from './decorator/validation';
export {type} from './decorator/type';
export {validatedResource} from './decorator/validated-resource';

export function configure(aurelia, configCallback) {
  let entityManagerInstance = aurelia.container.get(EntityManager);

  configCallback(entityManagerInstance);

  ValidationGroup.prototype.hasAssociation = function() {
    return this.isNotEmpty().passesRule(new HasAssociationValidationRule());
  };


  aurelia.globalResources('./component/association-select');
  aurelia.globalResources('./component/paged');
}

export {EntityManager, HasAssociationValidationRule, ValidationGroup};

import {getLogger} from 'aurelia-logger';
const logger = getLogger('aurelia-orm');
export {logger};
