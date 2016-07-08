import {OrmMetadata} from '../orm-metadata';

/**
 * Set the 'endpoint' metadta of an entity. Needs a set resource
 *
 * @param {String} entityEndpoint The endpoint name to use
 *
 * @return {Function}
 *
 * @decorator
 */
export function endpoint(entityEndpoint) {
  return function(target) {
    OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
  };
}
