import {OrmMetadata} from '../orm-metadata';

/**
 * Set the 'name' metadata on the entity
 *
 * @param {string} entityName=target.name.toLowerCase The (custom) name to use
 *
 * @return {function}
 *
 * @decorator
 */
export function name(entityName) {
  return function(target) {
    OrmMetadata.forTarget(target).put('name', entityName || target.name.toLowerCase());
  };
}
