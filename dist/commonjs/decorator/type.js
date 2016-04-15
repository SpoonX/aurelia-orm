'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.type = type;

var _ormMetadata = require('../orm-metadata');

function type(typeValue) {
  return function (target, propertyName) {
    _ormMetadata.OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
  };
}