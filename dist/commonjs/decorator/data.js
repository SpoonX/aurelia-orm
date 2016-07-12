'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.data = data;

var _aureliaOrm = require('../aurelia-orm');

var _ormMetadata = require('../orm-metadata');

function data(metaData) {
  return function (target, propertyName) {
    if ((typeof metaData === 'undefined' ? 'undefined' : _typeof(metaData)) !== 'object') {
      _aureliaOrm.logger.error('data must be an object, ' + (typeof metaData === 'undefined' ? 'undefined' : _typeof(metaData)) + ' given.');
    }

    _ormMetadata.OrmMetadata.forTarget(target.constructor).put('data', propertyName, metaData);
  };
}