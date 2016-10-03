import {logger} from '../aurelia-orm';
import {OrmMetadata} from '../orm-metadata';

/**
* Set generic 'data' metadata.
*
 * @param {{}} metaData The data to set
 *
 * @returns {function}
 *
 * @decorator
 */
export function data(metaData) {
  /**
   * @param {function} target
   * @param {string} propertyName
   */
  return function(target, propertyName) {
    if (typeof metaData !== 'object') {
      logger.error('data must be an object, ' + typeof metaData + ' given.');
    }

    OrmMetadata.forTarget(target.constructor).put('data', propertyName, metaData);
  };
}
