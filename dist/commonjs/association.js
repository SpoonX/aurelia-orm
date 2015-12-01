'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.association = association;

var _aureliaMetadata = require('aurelia-metadata');

var _associationMetadata = require('./association-metadata');

function association(entity) {
  return function (target, propertyName) {
    var associations = _aureliaMetadata.metadata.getOrCreateOwn(_associationMetadata.AssociationMetaData.key, _associationMetadata.AssociationMetaData, target);

    associations.add(propertyName, entity);
  };
}