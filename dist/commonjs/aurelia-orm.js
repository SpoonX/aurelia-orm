'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validatedResource = exports.type = exports.validation = exports.repository = exports.name = exports.endpoint = exports.resource = exports.association = exports.EntityManager = exports.OrmMetadata = exports.Entity = exports.Repository = exports.DefaultRepository = exports.configure = undefined;

var _entityManager = require('./entity-manager');

var _aureliaValidation = require('aurelia-validation');

var _hasAssociation = require('./validator/has-association');

var _defaultRepository = require('./default-repository');

var _repository = require('./repository');

var _entity = require('./entity');

var _ormMetadata = require('./orm-metadata');

var _association = require('./decorator/association');

var _resource = require('./decorator/resource');

var _endpoint = require('./decorator/endpoint');

var _name = require('./decorator/name');

var _repository2 = require('./decorator/repository');

var _validation = require('./decorator/validation');

var _type = require('./decorator/type');

var _validatedResource = require('./decorator/validated-resource');

function configure(aurelia, configCallback) {
  var entityManagerInstance = aurelia.container.get(_entityManager.EntityManager);

  configCallback(entityManagerInstance);

  _aureliaValidation.ValidationGroup.prototype.hasAssociation = function () {
    return this.isNotEmpty().passesRule(new _hasAssociation.HasAssociationValidationRule());
  };

  aurelia.globalResources('./component/association-select');
}

exports.configure = configure;
exports.DefaultRepository = _defaultRepository.DefaultRepository;
exports.Repository = _repository.Repository;
exports.Entity = _entity.Entity;
exports.OrmMetadata = _ormMetadata.OrmMetadata;
exports.EntityManager = _entityManager.EntityManager;
exports.association = _association.association;
exports.resource = _resource.resource;
exports.endpoint = _endpoint.endpoint;
exports.name = _name.name;
exports.repository = _repository2.repository;
exports.validation = _validation.validation;
exports.type = _type.type;
exports.validatedResource = _validatedResource.validatedResource;