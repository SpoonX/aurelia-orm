define(['exports', './default-repository', './repository', './entity', './entity-manager'], function (exports, _defaultRepository, _repository, _entity, _entityManager) {
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
});