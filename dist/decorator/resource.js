import {OrmMetadata} from '../orm-metadata';

/**
 * Set the 'resourceName' metadata on the entity
 *
 * @param {String} resourceName The name of the resource
 *
 * @return {Function}
 *
 * @decorator
 */
export function resource(resourceName) {
  return function(target) {
    OrmMetadata.forTarget(target).put('resource', resourceName || target.name.toLowerCase());
  };
}
