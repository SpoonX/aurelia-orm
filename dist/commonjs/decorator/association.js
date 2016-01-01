'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.association = association;

var _ormMetadata = require('../orm-metadata');

function association(associationData) {
  return function (target, propertyName) {
    if (!associationData) {
      associationData = { entity: propertyName };
    } else if (typeof associationData === 'string') {
      associationData = { entity: associationData };
    }

    _ormMetadata.OrmMetadata.forTarget(target.constructor).put('associations', propertyName, {
      type: associationData.entity ? 'entity' : 'collection',
      entity: associationData.entity || associationData.collection
    });
  };
}