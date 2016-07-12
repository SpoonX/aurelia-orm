define(['exports', '../orm-metadata'], function (exports, _ormMetadata) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.idProperty = idProperty;
  function idProperty(propertyName) {
    return function (target) {
      _ormMetadata.OrmMetadata.forTarget(target).put('idProperty', propertyName);
    };
  }
});