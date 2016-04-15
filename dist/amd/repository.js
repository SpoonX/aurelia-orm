define(['exports', 'aurelia-dependency-injection', 'aurelia-api', 'typer'], function (exports, _aureliaDependencyInjection, _aureliaApi, _typer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Repository = undefined;

  var _typer2 = _interopRequireDefault(_typer);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Repository = exports.Repository = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaApi.Config), _dec(_class = function () {
    function Repository(clientConfig) {
      _classCallCheck(this, Repository);

      this.transport = null;

      this.clientConfig = clientConfig;
    }

    Repository.prototype.getTransport = function getTransport() {
      if (this.transport === null) {
        this.transport = this.clientConfig.getEndpoint(this.getMeta().fetch('endpoint'));

        if (!this.transport) {
          throw new Error('No transport found for \'' + (this.getMeta().fetch('endpoint') || 'default') + '\'.');
        }
      }

      return this.transport;
    };

    Repository.prototype.setMeta = function setMeta(meta) {
      this.meta = meta;
    };

    Repository.prototype.getMeta = function getMeta() {
      return this.meta;
    };

    Repository.prototype.setResource = function setResource(resource) {
      this.resource = resource;

      return this;
    };

    Repository.prototype.getResource = function getResource() {
      return this.resource;
    };

    Repository.prototype.find = function find(criteria, raw) {
      return this.findPath(this.resource, criteria, raw);
    };

    Repository.prototype.findPath = function findPath(path, criteria, raw) {
      var _this = this;

      var findQuery = this.getTransport().find(path, criteria);

      if (raw) {
        return findQuery;
      }

      return findQuery.then(function (x) {
        return _this.populateEntities(x);
      }).then(function (populated) {
        if (!Array.isArray(populated)) {
          return populated.markClean();
        }

        populated.forEach(function (entity) {
          return entity.markClean();
        });

        return populated;
      });
    };

    Repository.prototype.count = function count(criteria) {
      return this.getTransport().find(this.resource + '/count', criteria);
    };

    Repository.prototype.populateEntities = function populateEntities(data) {
      var _this2 = this;

      if (!data) {
        return null;
      }

      if (!Array.isArray(data)) {
        return this.getPopulatedEntity(data);
      }

      var collection = [];

      data.forEach(function (source) {
        collection.push(_this2.getPopulatedEntity(source));
      });

      return collection;
    };

    Repository.prototype.getPopulatedEntity = function getPopulatedEntity(data, entity) {
      entity = entity || this.getNewEntity();
      var entityMetadata = entity.getMeta();
      var populatedData = {};
      var key = void 0;

      for (key in data) {
        if (!data.hasOwnProperty(key)) {
          continue;
        }

        var value = data[key];

        if (entityMetadata.has('types', key)) {
          populatedData[key] = _typer2.default.cast(value, entityMetadata.fetch('types', key));

          continue;
        }

        if (!entityMetadata.has('associations', key) || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
          populatedData[key] = value;

          continue;
        }

        var repository = this.entityManager.getRepository(entityMetadata.fetch('associations', key).entity);
        populatedData[key] = repository.populateEntities(value);
      }

      return entity.setData(populatedData);
    };

    Repository.prototype.getNewEntity = function getNewEntity() {
      return this.entityManager.getEntity(this.resource);
    };

    Repository.prototype.getNewPopulatedEntity = function getNewPopulatedEntity() {
      var entity = this.getNewEntity();
      var associations = entity.getMeta().fetch('associations');

      for (var property in associations) {
        var assocMeta = associations[property];

        if (assocMeta.type !== 'entity') {
          continue;
        }

        entity[property] = this.entityManager.getRepository(assocMeta.entity).getNewEntity();
      }

      return entity;
    };

    return Repository;
  }()) || _class);
});