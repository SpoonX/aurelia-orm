System.register(['../orm-metadata'], function (_export) {
  'use strict';

  var OrmMetadata;

  _export('association', association);

  function association(associationData) {
    return function (target, propertyName) {
      if (!associationData) {
        associationData = { entity: propertyName };
      } else if (typeof associationData === 'string') {
        associationData = { entity: associationData };
      }

      OrmMetadata.forTarget(target.constructor).put('associations', propertyName, {
        type: associationData.entity ? 'entity' : 'collection',
        entity: associationData.entity || associationData.collection
      });
    };
  }

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {}
  };
});