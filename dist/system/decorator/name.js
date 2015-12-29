System.register(['../orm-metadata'], function (_export) {
  'use strict';

  var OrmMetadata;

  _export('name', name);

  function name(resourceName) {
    return function (target) {
      OrmMetadata.forTarget(target).put('name', resourceName || target.name.toLowerCase());
    };
  }

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {}
  };
});