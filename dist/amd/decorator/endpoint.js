define(['exports', '../aurelia-orm', '../orm-metadata'], function (exports, _aureliaOrm, _ormMetadata) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.endpoint = endpoint;
  function endpoint(entityEndpoint) {
    return function (target) {
      if (!_ormMetadata.OrmMetadata.forTarget(target).fetch('resource')) {
        _aureliaOrm.logger.warn('Need to set the resource before setting the endpoint!');
      }

      _ormMetadata.OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
    };
  }
});