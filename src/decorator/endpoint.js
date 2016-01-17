import {OrmMetadata} from '../orm-metadata';

/**
 * @todo add docblocks
 * @todo update documentation
 * @todo update aurelia-auth
 * @todo update swan cli with skeleton
 *
 * @param entityEndpoint
 * @return {Function}
 */
export function endpoint(entityEndpoint) {
  return function(target) {
    OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
  };
}
