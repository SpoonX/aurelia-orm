import {logger} from '../aurelia-orm';
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
    if (!OrmMetadata.forTarget(target).fetch('resource')) {
      logger.warn('Need to set the resource before setting the endpoint!');
    }

    OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
  };
}
