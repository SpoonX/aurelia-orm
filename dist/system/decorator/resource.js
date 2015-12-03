System.register(['../orm-metadata'], function (_export) {
  'use strict';

  var OrmMetadata;

  _export('resource', resource);

  function resource(resourceName) {
    return function (target) {
      OrmMetadata.forTarget(target).put('resource', resourceName || target.name.toLowerCase());
    };
  }

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {}
  };
});