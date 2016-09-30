import {OrmMetadata} from '../orm-metadata';

/**
 * Set the id property for en entity
 *
 * @export
 * @param {string} propertyName
 * @returns {function}
 *
 * @deocator
 */
export function idProperty(propertyName) {
  return function(target) {
    OrmMetadata.forTarget(target).put('idProperty', propertyName);
  };
}
