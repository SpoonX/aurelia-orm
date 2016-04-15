'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resource = resource;

var _ormMetadata = require('../orm-metadata');

function resource(resourceName) {
  return function (target) {
    _ormMetadata.OrmMetadata.forTarget(target).put('resource', resourceName || target.name.toLowerCase());
  };
}