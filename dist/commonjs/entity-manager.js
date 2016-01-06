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

var _ormMetadata = require('./orm-metadata');

var EntityManager = (function () {
  function EntityManager(container) {
    _classCallCheck(this, _EntityManager);

    this.repositories = {};
    this.entities = {};

    this.container = container;
  }

  _createClass(EntityManager, [{
    key: 'registerEntities',
    value: function registerEntities(entities) {
      for (var reference in entities) {
        if (!entities.hasOwnProperty(reference)) {
          continue;
        }

        this.registerEntity(entities[reference]);
      }

      return this;
    }
  }, {
    key: 'registerEntity',
    value: function registerEntity(entity) {
      this.entities[_ormMetadata.OrmMetadata.forTarget(entity).fetch('resource')] = entity;

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

      var repository = _ormMetadata.OrmMetadata.forTarget(reference).fetch('repository');
      var instance = this.container.get(repository);

      if (instance.resource && instance.entityManager) {
        return instance;
      }

      instance.resource = resource;
      instance.entityManager = this;

      if (instance instanceof _defaultRepository.DefaultRepository) {
        this.repositories[resource] = instance;
      }

      return instance;
    }
  }, {
    key: 'resolveEntityReference',
    value: function resolveEntityReference(resource) {
      var entityReference = resource;

      if (typeof resource === 'string') {
        entityReference = this.entities[resource] || _entity.Entity;
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
      var resource = reference.getResource();

      if (!resource) {
        if (typeof entity !== 'string') {
          throw new Error('Unable to find resource for entity.');
        }

        resource = entity;
      }

      return instance.setResource(resource).setRepository(this.getRepository(resource));
    }
  }]);

  var _EntityManager = EntityManager;
  EntityManager = (0, _aureliaFramework.inject)(_aureliaDependencyInjection.Container)(EntityManager) || EntityManager;
  return EntityManager;
})();

exports.EntityManager = EntityManager;