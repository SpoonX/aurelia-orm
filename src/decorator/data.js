import {logger} from '../aurelia-orm';
import {OrmMetadata} from '../orm-metadata';

/**
 * used to set generic data on the metadata
 *
 * @param {object} data
 *
 * @returns {function}
 *
 * @decorator
 */
export function data(metaData) {
  /**
   * @param {function} target
   * @param {string} propertyName
   *
   * @returns {OrmMetadata}
   */
  return function(target, propertyName) {
    typeof metaData !== 'object' && logger.error('data must be an object, it is a(n) ' + typeof metaData);
    OrmMetadata.forTarget(target.constructor).put('data', propertyName, metaData);
  };
}
