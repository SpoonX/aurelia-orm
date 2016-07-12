import { logger } from '../aurelia-orm';
import { OrmMetadata } from '../orm-metadata';

export function data(metaData) {
  return function (target, propertyName) {
    if (typeof metaData !== 'object') {
      logger.error('data must be an object, ' + typeof metaData + ' given.');
    }

    OrmMetadata.forTarget(target.constructor).put('data', propertyName, metaData);
  };
}