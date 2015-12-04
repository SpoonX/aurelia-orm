'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.configure = configure;

var _entityManager = require('./entity-manager');

var _defaultRepository = require('./default-repository');

Object.defineProperty(exports, 'DefaultRepository', {
  enumerable: true,
  get: function get() {
    return _defaultRepository.DefaultRepository;
  }
});

var _repository = require('./repository');

Object.defineProperty(exports, 'Repository', {
  enumerable: true,
  get: function get() {
    return _repository.Repository;
  }
});

var _entity = require('./entity');

Object.defineProperty(exports, 'Entity', {
  enumerable: true,
  get: function get() {
    return _entity.Entity;
  }
});
Object.defineProperty(exports, 'EntityManager', {
  enumerable: true,
  get: function get() {
    return _entityManager.EntityManager;
  }
});

var _decoratorAssociation = require('./decorator/association');

Object.defineProperty(exports, 'association', {
  enumerable: true,
  get: function get() {
    return _decoratorAssociation.association;
  }
});

var _decoratorResource = require('./decorator/resource');

Object.defineProperty(exports, 'resource', {
  enumerable: true,
  get: function get() {
    return _decoratorResource.resource;
  }
});

var _decoratorRepository = require('./decorator/repository');

Object.defineProperty(exports, 'repository', {
  enumerable: true,
  get: function get() {
    return _decoratorRepository.repository;
  }
});

var _decoratorValidation = require('./decorator/validation');

Object.defineProperty(exports, 'validation', {
  enumerable: true,
  get: function get() {
    return _decoratorValidation.validation;
  }
});

var _decoratorValidatedResource = require('./decorator/validated-resource');

Object.defineProperty(exports, 'validatedResource', {
  enumerable: true,
  get: function get() {
    return _decoratorValidatedResource.validatedResource;
  }
});

function configure(aurelia, configCallback) {
  var entityManagerInstance = aurelia.container.get(_entityManager.EntityManager);

  configCallback(entityManagerInstance);
}