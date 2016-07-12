'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.idProperty = idProperty;

var _ormMetadata = require('../orm-metadata');

function idProperty(propertyName) {
  return function (target) {
    _ormMetadata.OrmMetadata.forTarget(target).put('idProperty', propertyName);
  };
}