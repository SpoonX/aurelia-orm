define(['exports', './entity-manager', './default-repository', './repository', './entity', './decorator/association', './decorator/resource', './decorator/repository', './decorator/validation', './decorator/validated-resource'], function (exports, _entityManager, _defaultRepository, _repository, _entity, _decoratorAssociation, _decoratorResource, _decoratorRepository, _decoratorValidation, _decoratorValidatedResource) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.configure = configure;
  Object.defineProperty(exports, 'DefaultRepository', {
    enumerable: true,
    get: function get() {
      return _defaultRepository.DefaultRepository;
    }
  });
  Object.defineProperty(exports, 'Repository', {
    enumerable: true,
    get: function get() {
      return _repository.Repository;
    }
  });
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
  Object.defineProperty(exports, 'association', {
    enumerable: true,
    get: function get() {
      return _decoratorAssociation.association;
    }
  });
  Object.defineProperty(exports, 'resource', {
    enumerable: true,
    get: function get() {
      return _decoratorResource.resource;
    }
  });
  Object.defineProperty(exports, 'repository', {
    enumerable: true,
    get: function get() {
      return _decoratorRepository.repository;
    }
  });
  Object.defineProperty(exports, 'validation', {
    enumerable: true,
    get: function get() {
      return _decoratorValidation.validation;
    }
  });
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
});