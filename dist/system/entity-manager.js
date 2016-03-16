'use strict';

System.register(['./entity', './default-repository', 'aurelia-dependency-injection', './orm-metadata'], function (_export, _context) {
  var Entity, DefaultRepository, Container, inject, OrmMetadata, _dec, _class, EntityManager;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_entity) {
      Entity = _entity.Entity;
    }, function (_defaultRepository) {
      DefaultRepository = _defaultRepository.DefaultRepository;
    }, function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
      inject = _aureliaDependencyInjection.inject;
    }, function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {
      _export('EntityManager', EntityManager = (_dec = inject(Container), _dec(_class = function () {
        function EntityManager(container) {
          _classCallCheck(this, EntityManager);

          this.repositories = {};
          this.entities = {};

          this.container = container;
        }

        EntityManager.prototype.registerEntities = function registerEntities(entities) {
          for (var reference in entities) {
            if (!entities.hasOwnProperty(reference)) {
              continue;
            }

            this.registerEntity(entities[reference]);
          }

          return this;
        };

        EntityManager.prototype.registerEntity = function registerEntity(entity) {
          this.entities[OrmMetadata.forTarget(entity).fetch('resource')] = entity;

          return this;
        };

        EntityManager.prototype.getRepository = function getRepository(entity) {
          var reference = this.resolveEntityReference(entity);
          var resource = entity;

          if (typeof reference.getResource === 'function') {
            resource = reference.getResource() || resource;
          }

          if (typeof resource !== 'string') {
            throw new Error('Unable to find resource for entity.');
          }

          if (this.repositories[resource]) {
            return this.repositories[resource];
          }

          var metaData = OrmMetadata.forTarget(reference);
          var repository = metaData.fetch('repository');
          var instance = this.container.get(repository);

          if (instance.meta && instance.resource && instance.entityManager) {
            return instance;
          }

          instance.setMeta(metaData);
          instance.resource = resource;
          instance.entityManager = this;

          if (instance instanceof DefaultRepository) {
            this.repositories[resource] = instance;
          }

          return instance;
        };

        EntityManager.prototype.resolveEntityReference = function resolveEntityReference(resource) {
          var entityReference = resource;

          if (typeof resource === 'string') {
            entityReference = this.entities[resource] || Entity;
          }

          if (typeof entityReference === 'function') {
            return entityReference;
          }

          throw new Error('Unable to resolve to entity reference. Expected string or function.');
        };

        EntityManager.prototype.getEntity = function getEntity(entity) {
          var reference = this.resolveEntityReference(entity);
          var instance = this.container.get(reference);
          var resource = reference.getResource();

          if (!resource) {
            if (typeof entity !== 'string') {
              throw new Error('Unable to find resource for entity.');
            }

            resource = entity;
          }

          return instance.setResource(resource).setRepository(this.getRepository(resource));
        };

        return EntityManager;
      }()) || _class));

      _export('EntityManager', EntityManager);
    }
  };
});