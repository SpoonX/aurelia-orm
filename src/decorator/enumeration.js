import {OrmMetadata} from '../orm-metadata';
import {ensurePropertyIsConfigurable} from './utils';

/**
 * Registers the 'enumerations' for an attribute's values
 *
 * @param {*[]} values - a list of valid values for the entity's attribute
 *
 * @return {Function}
 *
 * @decorator
 */
export function enumeration(values) {
  return function(target, propertyName, descriptor) {
    ensurePropertyIsConfigurable(target, propertyName, descriptor);

    OrmMetadata.forTarget(target.constructor).put('enumerations', propertyName, values);
  };
}
