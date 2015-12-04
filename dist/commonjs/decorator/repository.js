'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.repository = repository;

var _ormMetadata = require('../orm-metadata');

function repository(repository) {
  return function (target) {
    _ormMetadata.OrmMetadata.forTarget(target).put('repository', repository);
  };
}