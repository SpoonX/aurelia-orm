'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validation = validation;

var _ormMetadata = require('../orm-metadata');

function validation() {
  return function (target) {
    _ormMetadata.OrmMetadata.forTarget(target).put('validation', true);
  };
}