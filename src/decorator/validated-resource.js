import {resource} from './resource';

/**
 * Set the 'resource' metadata and enables validation on the entity
 *
 * @param {String} resourceName The name of the resource
 *
 * @return {Function}
 *
 * @decorator
 */
export function validatedResource(resourceName) {
  return function(target, propertyName) {
    resource(resourceName)(target);
    console.warn('@validatedResource is obsolete');
  };
}
