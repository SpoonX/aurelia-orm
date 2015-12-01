System.register(['aurelia-metadata', './association-metadata'], function (_export) {
  'use strict';

  var metadata, AssociationMetaData;

  _export('association', association);

  function association(entity) {
    return function (target, propertyName) {
      var associations = metadata.getOrCreateOwn(AssociationMetaData.key, AssociationMetaData, target);

      associations.add(propertyName, entity);
    };
  }

  return {
    setters: [function (_aureliaMetadata) {
      metadata = _aureliaMetadata.metadata;
    }, function (_associationMetadata) {
      AssociationMetaData = _associationMetadata.AssociationMetaData;
    }],
    execute: function () {}
  };
});