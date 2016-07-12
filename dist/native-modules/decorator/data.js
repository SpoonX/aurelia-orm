var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

import { logger } from '../aurelia-orm';
import { OrmMetadata } from '../orm-metadata';

export function data(metaData) {
  return function (target, propertyName) {
    if ((typeof metaData === 'undefined' ? 'undefined' : _typeof(metaData)) !== 'object') {
      logger.error('data must be an object, ' + (typeof metaData === 'undefined' ? 'undefined' : _typeof(metaData)) + ' given.');
    }

    OrmMetadata.forTarget(target.constructor).put('data', propertyName, metaData);
  };
}