define(['exports', '../orm-metadata'], function (exports, _ormMetadata) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.type = type;

  function type(typeValue) {
    return function (target, propertyName) {
      _ormMetadata.OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
    };
  }
});