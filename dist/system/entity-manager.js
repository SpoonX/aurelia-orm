System.register(['./entity', './default-repository', 'aurelia-framework', 'aurelia-dependency-injection'], function (_export) {
  'use strict';

  var Entity, DefaultRepository, inject, Container, EntityManager;

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
    }],
    execute: function () {
      EntityManager = (function () {
        function EntityManager(container) {
          _classCallCheck(this, _EntityManager);

          this.repositories = {};

          this.container = container;
        }

        _createClass(EntityManager, [{
          key: 'getRepository',
          value: function getRepository(repository) {
            if (typeof repository === 'string') {
              return this.createRepository(repository);
            }

            var repositoryInstance = this.container.get(typeof repository === 'function' || typeof repository === 'object' ? repository : DefaultRepository);

            if (repositoryInstance instanceof Entity) {
              repositoryInstance = this.container.get(DefaultRepository).setEntity(repositoryInstance).setEntityReference(repository);
            } else {}

            repositoryInstance.entityManager = this;

            return repositoryInstance;
          }
        }, {
          key: 'createRepository',
          value: function createRepository(repository) {
            if (!this.repositories[repository]) {
              this.repositories[repository] = this.container.get(DefaultRepository).setEntity(this.getEntity(repository)).setEntityReference(repository);

              this.repositories[repository].entityManager = this;
            }

            return this.repositories[repository];
          }
        }, {
          key: 'getEntity',
          value: function getEntity(entity) {
            if (typeof entity === 'function') {
              return this.container.get(entity);
            }

            return this.container.get(Entity).setResource(entity);
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