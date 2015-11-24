'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _entity = require('./entity');

var _defaultRepository = require('./default-repository');

var _aureliaFramework = require('aurelia-framework');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var EntityManager = (function () {
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

      var repositoryInstance = this.container.get(typeof repository === 'function' || typeof repository === 'object' ? repository : _defaultRepository.DefaultRepository);

      if (repositoryInstance instanceof _entity.Entity) {
        repositoryInstance = this.container.get(_defaultRepository.DefaultRepository).setEntity(repositoryInstance).setEntityReference(repository);
      } else {}

      repositoryInstance.entityManager = this;

      return repositoryInstance;
    }
  }, {
    key: 'createRepository',
    value: function createRepository(repository) {
      if (!this.repositories[repository]) {
        this.repositories[repository] = this.container.get(_defaultRepository.DefaultRepository).setEntity(this.getEntity(repository)).setEntityReference(repository);

        this.repositories[repository].entityManager = this;
      }

      return this.repositories[repository];
    }
  }, {
    key: 'getEntity',
    value: function getEntity(entity) {
      if (typeof entity === 'object') {
        return this.container.get(entity);
      }

      return this.container.get(_entity.Entity).setResource(entity);
    }
  }]);

  var _EntityManager = EntityManager;
  EntityManager = (0, _aureliaFramework.inject)(_aureliaDependencyInjection.Container)(EntityManager) || EntityManager;
  return EntityManager;
})();

exports.EntityManager = EntityManager;