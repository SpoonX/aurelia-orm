define(['exports', './default-repository', './repository', './entity', './entity-manager', './association'], function (exports, _defaultRepository, _repository, _entity, _entityManager, _association) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
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
      return _association.association;
    }
  });
});