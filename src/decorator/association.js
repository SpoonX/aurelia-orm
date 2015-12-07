import {OrmMetadata} from '../orm-metadata';

export function association(resource) {
  return function(target, propertyName) {
    OrmMetadata.forTarget(target.constructor).put('associations', propertyName, resource || propertyName);
  };
}
