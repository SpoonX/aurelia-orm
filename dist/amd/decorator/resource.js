define(['exports', '../orm-metadata'], function (exports, _ormMetadata) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.resource = resource;

  function resource(resourceName) {
    return function (target) {
      _ormMetadata.OrmMetadata.forTarget(target).put('resource', resourceName || target.name.toLowerCase());
    };
  }
});