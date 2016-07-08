import {logger} from '../logger';
import {OrmMetadata} from '../orm-metadata';

/**
 * @param {String} entityEndpoint
 *
 * @return {Function}
 */
export function endpoint(entityEndpoint) {
  return function(target) {
    if (!OrmMetadata.forTarget(target).fetch('resource')) {
      logger.warn('Need to set the resource before setting the endpoint!');
    }

    OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
  };
}
