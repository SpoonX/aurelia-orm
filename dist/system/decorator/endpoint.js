System.register(['../orm-metadata'], function (_export) {
  'use strict';

  var OrmMetadata;

  _export('endpoint', endpoint);

  function endpoint(entityEndpoint) {
    return function (target) {
      OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
    };
  }

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {}
  };
});