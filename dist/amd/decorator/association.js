define(['exports', '../orm-metadata'], function (exports, _ormMetadata) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.association = association;

  function association(resource) {
    return function (target, propertyName) {
      _ormMetadata.OrmMetadata.forTarget(target.constructor).put('associations', propertyName, resource || propertyName);
    };
  }
});