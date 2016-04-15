'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.repository = repository;

var _ormMetadata = require('../orm-metadata');

function repository(repositoryReference) {
  return function (target) {
    _ormMetadata.OrmMetadata.forTarget(target).put('repository', repositoryReference);
  };
}