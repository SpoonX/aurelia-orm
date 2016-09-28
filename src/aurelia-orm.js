import {getLogger} from 'aurelia-logging';
import {EntityManager} from './entity-manager';
import {ValidationRules} from 'aurelia-validation';
import {Entity} from './entity';

export function configure(aurelia, configCallback) {
  // add hasAssociation custom validation rule
  ValidationRules.customRule(
    'hasAssociation',
    value => !!((value instanceof Entity && typeof value.id === 'number') || typeof value === 'number'),
    `\${$displayName} must be an association.`    // eslint-disable-line quotes
  );

  let entityManagerInstance = aurelia.container.get(EntityManager);

  configCallback(entityManagerInstance);

  aurelia.globalResources('./component/association-select');
  aurelia.globalResources('./component/paged');
}

export const logger = getLogger('aurelia-orm');
