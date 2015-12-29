'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.name = name;

var _ormMetadata = require('../orm-metadata');

function name(entityName) {
  return function (target) {
    _ormMetadata.OrmMetadata.forTarget(target).put('name', entityName || target.name.toLowerCase());
  };
}