System.register(['../orm-metadata'], function (_export) {
  'use strict';

  var OrmMetadata;

  _export('association', association);

  function association(resource) {
    return function (target, propertyName) {
      OrmMetadata.forTarget(target.constructor).put('associations', propertyName, resource || propertyName);
    };
  }

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {}
  };
});