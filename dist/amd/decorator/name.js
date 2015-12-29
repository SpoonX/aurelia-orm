define(['exports', '../orm-metadata'], function (exports, _ormMetadata) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.name = name;

  function name(resourceName) {
    return function (target) {
      _ormMetadata.OrmMetadata.forTarget(target).put('name', resourceName || target.name.toLowerCase());
    };
  }
});