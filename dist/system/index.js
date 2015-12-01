System.register(['./default-repository', './repository', './entity', './entity-manager', './association'], function (_export) {
  'use strict';

  return {
    setters: [function (_defaultRepository) {
      _export('DefaultRepository', _defaultRepository.DefaultRepository);
    }, function (_repository) {
      _export('Repository', _repository.Repository);
    }, function (_entity) {
      _export('Entity', _entity.Entity);
    }, function (_entityManager) {
      _export('EntityManager', _entityManager.EntityManager);
    }, function (_association) {
      _export('association', _association.association);
    }],
    execute: function () {}
  };
});