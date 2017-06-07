import {getLogger} from 'aurelia-logging';
import {EntityManager} from './entity-manager';
import {ValidationRules} from 'aurelia-validation';
import {Entity} from './entity';

import {AssociationSelect} from './component/association-select'; // eslint-disable-line no-unused-vars
import {Paged} from './component/paged'; // eslint-disable-line no-unused-vars
import {Config as ViewManagerConfig} from 'aurelia-view-manager';

/**
 * Plugin configure
 *
 * @export
 * @param {*} frameworkConfig
 * @param {*} configCallback
 */
export function configure(frameworkConfig, configCallback) {
  // add hasAssociation custom validation rule
  ValidationRules.customRule(
    'hasAssociation',
    value => (value instanceof Entity && typeof value.id === 'number') || typeof value === 'number',
    `\${$displayName} must be an association.`    // eslint-disable-line quotes
  );

  let entityManagerInstance = frameworkConfig.container.get(EntityManager);

  configCallback(entityManagerInstance);

  frameworkConfig.container.get(ViewManagerConfig).configureNamespace('spoonx/orm', {
     location: './view/{{framework}}/{{view}}.html'
  });

  frameworkConfig.globalResources('./component/association-select');
  frameworkConfig.globalResources('./component/paged');
}

export const logger = getLogger('aurelia-orm');
