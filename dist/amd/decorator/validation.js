define(['exports', '../orm-metadata'], function (exports, _ormMetadata) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.validation = validation;
  function validation() {
    return function (target) {
      _ormMetadata.OrmMetadata.forTarget(target).put('validation', true);
    };
  }
});