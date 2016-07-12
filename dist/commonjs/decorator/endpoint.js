'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.endpoint = endpoint;

var _aureliaOrm = require('../aurelia-orm');

var _ormMetadata = require('../orm-metadata');

function endpoint(entityEndpoint) {
  return function (target) {
    if (!_ormMetadata.OrmMetadata.forTarget(target).fetch('resource')) {
      _aureliaOrm.logger.warn('Need to set the resource before setting the endpoint!');
    }

    _ormMetadata.OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
  };
}