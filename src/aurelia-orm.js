import {getLogger} from 'aurelia-logging';
import {EntityManager} from './entity-manager';

import {ValidationRules} from 'aurelia-validation';
import {Entity} from './entity';

export function configure(aurelia, configCallback) {
  // first our configurations
  // add custom rules
  ValidationRules.customRule(
    'hasAssociation',
    value => !!((value instanceof Entity && typeof value.id === 'number') || typeof value === 'number'),
    `\${$displayName} must be an association.`    // eslint-disable-line quotes
  );

  ValidationRules.customRule(
    'hasCollectionAssociation',
    values => {
      if (!Array.isArray(values)) {
        return false;
      }

      for (let value of values) {
        if ( !((value instanceof Entity && typeof value.id === 'number') || typeof value === 'number')) {
          return false;
        }
      }

      return true;
    },
    `\${$displayName} must be a collection association.`    // eslint-disable-line quotes
  );

  // then user configuration
  let entityManagerInstance = aurelia.container.get(EntityManager);

  configCallback(entityManagerInstance);

  // then global resouces
  aurelia.globalResources('./component/association-select');
  aurelia.globalResources('./component/paged');
}

export const logger = getLogger('aurelia-orm');
