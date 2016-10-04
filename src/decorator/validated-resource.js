import {resource} from './resource';
import {validation} from './validation';

/**
 * Set the 'resource' metadata and enables validation on the entity
 *
 * @param {string} resourceName The name of the resource
 * @param {[function]} ValidatorClass = Validator
 *
 * @return {function}
 *
 * @decorator
 */
export function validatedResource(resourceName, ValidatorClass) {
  return function(target, propertyName) {
    resource(resourceName)(target);
    validation(ValidatorClass)(target, propertyName);
  };
}
