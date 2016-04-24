import {OrmMetadata} from '../orm-metadata';

/**
 * @param {String} entityEndpoint
 *
 * @return {Function}
 */
export function endpoint(entityEndpoint) {
  return function(target) {
    let meta = OrmMetadata.forTarget(target);

    // add default resource<
    if (!meta.fetch('resource'))
      meta.put('resource', target.name.toLowerCase());

    meta.put('endpoint', entityEndpoint);
  };
}
