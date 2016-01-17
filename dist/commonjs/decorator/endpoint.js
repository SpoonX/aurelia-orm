'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.endpoint = endpoint;

var _ormMetadata = require('../orm-metadata');

function endpoint(entityEndpoint) {
  return function (target) {
    _ormMetadata.OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
  };
}