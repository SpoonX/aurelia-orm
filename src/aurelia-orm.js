import {getLogger} from 'aurelia-logging';
import {EntityManager} from './entity-manager';
import {HasAssociationValidationRule} from './validator/has-association';
import {ValidationGroup} from 'aurelia-validation';

export function configure(aurelia, configCallback) {
  let entityManagerInstance = aurelia.container.get(EntityManager);

  configCallback(entityManagerInstance);

  ValidationGroup.prototype.hasAssociation = function() {
    return this.isNotEmpty().passesRule(new HasAssociationValidationRule());
  };

  aurelia.globalResources('./component/association-select');
  aurelia.globalResources('./component/paged');
}

export const logger = getLogger('aurelia-orm');
