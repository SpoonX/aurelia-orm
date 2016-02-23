System.register(['../orm-metadata'], function (_export) {
  'use strict';

  var OrmMetadata;

  _export('type', type);

  function type(typeValue) {
    return function (target, propertyName) {
      OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
    };
  }

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {}
  };
});