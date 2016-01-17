import {OrmMetadata} from '../orm-metadata';

/**
 * @param {String} entityEndpoint
 *
 * @return {Function}
 */
export function endpoint(entityEndpoint) {
  return function(target) {
    OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
  };
}
