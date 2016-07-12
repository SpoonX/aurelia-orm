import {OrmMetadata} from '../orm-metadata';

/**
 * Set the 'validation' metadata to 'true'
 *
 * @return {Function}
 *
 * @decorator
 */
export function validation() {
  return function(target) {
    OrmMetadata.forTarget(target).put('validation', true);
  };
}
