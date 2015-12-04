System.register(['./entity', './default-repository', 'aurelia-framework', 'aurelia-dependency-injection', './orm-metadata'], function (_export) {
  'use strict';

  var Entity, DefaultRepository, inject, Container, OrmMetadata, EntityManager;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_entity) {
      Entity = _entity.Entity;
    }, function (_defaultRepository) {
      DefaultRepository = _defaultRepository.DefaultRepository;
    }, function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {
      EntityManager = (function () {
        function EntityManager(container) {
          _classCallCheck(this, _EntityManager);

          this.repositories = {};
          this.entities = {};

          this.container = container;
        }

        _createClass(EntityManager, [{
          key: 'registerEntities',
          value: function registerEntities(entities) {
            var _this = this;

            entities.forEach(function (entity) {
              _this.registerEntity(entity);
            });

            return this;
          }
        }, {
          key: 'registerEntity',
          value: function registerEntity(entity) {
            this.entities[OrmMetadata.forTarget(entity).fetch('resource')] = entity;

            return this;
          }
        }, {
          key: 'getRepository',
          value: function getRepository(entity) {
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

            var repository = OrmMetadata.forTarget(reference).fetch('repository');
            var instance = this.container.get(repository);

            if (instance.resource && instance.entityManager) {
              return instance;
            }

            instance.resource = resource;
            instance.entityManager = this;

            if (instance instanceof DefaultRepository) {
              this.repositories[resource] = instance;
            }

            return instance;
          }
        }, {
          key: 'resolveEntityReference',
          value: function resolveEntityReference(resource) {
            var entityReference = resource;

            if (typeof resource === 'string') {
              entityReference = this.entities[resource] || Entity;
            }

            if (typeof entityReference === 'function') {
              return entityReference;
            }

            throw new Error('Unable to resolve to entity reference. Expected string or function.');
          }
        }, {
          key: 'getEntity',
          value: function getEntity(entity) {
            var reference = this.resolveEntityReference(entity);
            var instance = this.container.get(reference);

            if (reference.getResource()) {
              return instance.setResource(reference.getResource());
            }

            if (typeof entity !== 'string') {
              throw new Error('Unable to find resource for entity.');
            }

            instance.setResource(entity);

            return instance;
          }
        }]);

        var _EntityManager = EntityManager;
        EntityManager = inject(Container)(EntityManager) || EntityManager;
        return EntityManager;
      })();

      _export('EntityManager', EntityManager);
    }
  };
});