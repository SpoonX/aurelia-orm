import {OrmMetadata} from '../orm-metadata';

/**
 * Set the id property for en entity
 *
 * @export
 * @param {string} propertyName
 * @returns {function}
 *
 * @decorator
 */
export function idProperty(propertyName) {
  return function(target) {
    OrmMetadata.forTarget(target).put('idProperty', propertyName);
  };
}
