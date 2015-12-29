System.register(['../orm-metadata'], function (_export) {
  'use strict';

  var OrmMetadata;

  _export('name', name);

  function name(entityName) {
    return function (target) {
      OrmMetadata.forTarget(target).put('name', entityName || target.name.toLowerCase());
    };
  }

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {}
  };
});