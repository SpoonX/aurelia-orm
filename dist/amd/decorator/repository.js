define(['exports', '../orm-metadata'], function (exports, _ormMetadata) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.repository = repository;

  function repository(repository) {
    return function (target) {
      _ormMetadata.OrmMetadata.forTarget(target).put('repository', repository);
    };
  }
});