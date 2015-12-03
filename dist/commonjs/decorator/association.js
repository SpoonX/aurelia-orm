'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.association = association;

var _ormMetadata = require('../orm-metadata');

function association(resource) {
  return function (target, propertyName) {
    _ormMetadata.OrmMetadata.forTarget(target.constructor).put('associations', propertyName, resource || propertyName);
  };
}