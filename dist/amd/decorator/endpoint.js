define(['exports', '../orm-metadata'], function (exports, _ormMetadata) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.endpoint = endpoint;
  function endpoint(entityEndpoint) {
    return function (target) {
      _ormMetadata.OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
    };
  }
});