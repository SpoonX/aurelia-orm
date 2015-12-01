define(['exports', 'aurelia-metadata', './association-metadata'], function (exports, _aureliaMetadata, _associationMetadata) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.association = association;

  function association(entity) {
    return function (target, propertyName) {
      var associations = _aureliaMetadata.metadata.getOrCreateOwn(_associationMetadata.AssociationMetaData.key, _associationMetadata.AssociationMetaData, target);

      associations.add(propertyName, entity);
    };
  }
});