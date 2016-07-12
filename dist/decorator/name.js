import {OrmMetadata} from '../orm-metadata';

/**
 * Set the 'name' metadata on the entity
 *
 * @param {String} entityName=target.name.toLowerCase The (custom) name to use
 *
 * @return {Function}
 *
 * @decorator
 */
export function name(entityName) {
  return function(target) {
    OrmMetadata.forTarget(target).put('name', entityName || target.name.toLowerCase());
  };
}
