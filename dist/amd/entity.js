define(['exports', 'aurelia-validation', 'aurelia-dependency-injection', './orm-metadata'], function (exports, _aureliaValidation, _aureliaDependencyInjection, _ormMetadata) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Entity = undefined;

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

  var _dec, _dec2, _class;

  var Entity = exports.Entity = (_dec = (0, _aureliaDependencyInjection.transient)(), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaValidation.Validation), _dec(_class = _dec2(_class = function () {
    function Entity(validator) {
      _classCallCheck(this, Entity);

      this.define('__meta', _ormMetadata.OrmMetadata.forTarget(this.constructor)).define('__cleanValues', {}, true);

      if (!this.hasValidation()) {
        return this;
      }

      return this.define('__validator', validator);
    }

    Entity.prototype.getTransport = function getTransport() {
      return this.getRepository().getTransport();
    };

    Entity.prototype.getRepository = function getRepository() {
      return this.__repository;
    };

    Entity.prototype.setRepository = function setRepository(repository) {
      return this.define('__repository', repository);
    };

    Entity.prototype.define = function define(property, value, writable) {
      Object.defineProperty(this, property, {
        value: value,
        writable: !!writable,
        enumerable: false
      });

      return this;
    };

    Entity.prototype.getMeta = function getMeta() {
      return this.__meta;
    };

    Entity.prototype.save = function save() {
      var _this = this;

      if (!this.isNew()) {
        return this.update();
      }

      var response = void 0;
      return this.getTransport().create(this.getResource(), this.asObject(true)).then(function (created) {
        _this.id = created.id;
        response = created;
      }).then(function () {
        return _this.saveCollections();
      }).then(function () {
        return _this.markClean();
      }).then(function () {
        return response;
      });
    };

    Entity.prototype.update = function update() {
      var _this2 = this;

      if (this.isNew()) {
        throw new Error('Required value "id" missing on entity.');
      }

      if (this.isClean()) {
        return Promise.resolve(null);
      }

      var requestBody = this.asObject(true);
      var response = void 0;

      delete requestBody.id;

      return this.getTransport().update(this.getResource(), this.id, requestBody).then(function (updated) {
        return response = updated;
      }).then(function () {
        return _this2.saveCollections();
      }).then(function () {
        return _this2.markClean();
      }).then(function () {
        return response;
      });
    };

    Entity.prototype.addCollectionAssociation = function addCollectionAssociation(entity, property) {
      property = property || getPropertyForAssociation(this, entity);
      var body = undefined;
      var url = [this.getResource(), this.id, property];

      if (this.isNew()) {
        throw new Error('Cannot add association to entity that does not have an id.');
      }

      if (!(entity instanceof Entity)) {
        url.push(entity);

        return this.getTransport().create(url.join('/'));
      }

      if (entity.isNew()) {
        body = entity.asObject();
      } else {
        url.push(entity.id);
      }

      return this.getTransport().create(url.join('/'), body).then(function (created) {
        return entity.setData(created).markClean();
      });
    };

    Entity.prototype.removeCollectionAssociation = function removeCollectionAssociation(entity, property) {
      property = property || getPropertyForAssociation(this, entity);
      var idToRemove = entity;

      if (entity instanceof Entity) {
        if (!entity.id) {
          return Promise.resolve(null);
        }

        idToRemove = entity.id;
      }

      return this.getTransport().destroy([this.getResource(), this.id, property, idToRemove].join('/'));
    };

    Entity.prototype.saveCollections = function saveCollections() {
      var _this3 = this;

      var tasks = [];
      var currentCollections = getCollectionsCompact(this);
      var cleanCollections = this.__cleanValues.data ? this.__cleanValues.data.collections : null;

      var addTasksForDifferences = function addTasksForDifferences(base, candidate, method) {
        if (base === null) {
          return;
        }

        Object.getOwnPropertyNames(base).forEach(function (property) {
          base[property].forEach(function (id) {
            if (candidate === null || !Array.isArray(candidate[property]) || candidate[property].indexOf(id) === -1) {
              tasks.push(method.call(_this3, id, property));
            }
          });
        });
      };

      addTasksForDifferences(currentCollections, cleanCollections, this.addCollectionAssociation);

      addTasksForDifferences(cleanCollections, currentCollections, this.removeCollectionAssociation);

      return Promise.all(tasks).then(function (results) {
        if (!Array.isArray(results)) {
          return _this3;
        }

        var newState = null;

        while (newState === null) {
          newState = results.pop();
        }

        if (newState) {
          _this3.getRepository().getPopulatedEntity(newState, _this3);
        }

        return _this3;
      });
    };

    Entity.prototype.markClean = function markClean() {
      var cleanValues = getFlat(this);
      this.__cleanValues = {
        checksum: JSON.stringify(cleanValues),
        data: cleanValues
      };

      return this;
    };

    Entity.prototype.isClean = function isClean() {
      return getFlat(this, true) === this.__cleanValues.checksum;
    };

    Entity.prototype.isDirty = function isDirty() {
      return !this.isClean();
    };

    Entity.prototype.isNew = function isNew() {
      return typeof this.id === 'undefined';
    };

    Entity.getResource = function getResource() {
      return _ormMetadata.OrmMetadata.forTarget(this).fetch('resource');
    };

    Entity.prototype.getResource = function getResource() {
      return this.__resource || this.getMeta().fetch('resource');
    };

    Entity.prototype.setResource = function setResource(resource) {
      return this.define('__resource', resource);
    };

    Entity.prototype.destroy = function destroy() {
      if (!this.id) {
        throw new Error('Required value "id" missing on entity.');
      }

      return this.getTransport().destroy(this.getResource(), this.id);
    };

    Entity.prototype.getName = function getName() {
      var metaName = this.getMeta().fetch('name');

      if (metaName) {
        return metaName;
      }

      return this.getResource();
    };

    Entity.getName = function getName() {
      var metaName = _ormMetadata.OrmMetadata.forTarget(this).fetch('name');

      if (metaName) {
        return metaName;
      }

      return this.getResource();
    };

    Entity.prototype.setData = function setData(data) {
      Object.assign(this, data);

      return this;
    };

    Entity.prototype.enableValidation = function enableValidation() {
      if (!this.hasValidation()) {
        throw new Error('Entity not marked as validated. Did you forget the @validation() decorator?');
      }

      if (this.__validation) {
        return this;
      }

      return this.define('__validation', this.__validator.on(this));
    };

    Entity.prototype.getValidation = function getValidation() {
      if (!this.hasValidation()) {
        return null;
      }

      if (!this.__validation) {
        this.enableValidation();
      }

      return this.__validation;
    };

    Entity.prototype.hasValidation = function hasValidation() {
      return !!this.getMeta().fetch('validation');
    };

    Entity.prototype.asObject = function asObject(shallow) {
      return _asObject(this, shallow);
    };

    Entity.prototype.asJson = function asJson(shallow) {
      return _asJson(this, shallow);
    };

    return Entity;
  }()) || _class) || _class);

  function _asObject(entity, shallow) {
    var pojo = {};
    var metadata = entity.getMeta();

    Object.keys(entity).forEach(function (propertyName) {
      var value = entity[propertyName];

      if (!metadata.has('associations', propertyName) || !value) {
        pojo[propertyName] = value;

        return;
      }

      if (shallow && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.id) {
        pojo[propertyName] = value.id;

        return;
      }

      if (!Array.isArray(value)) {
        pojo[propertyName] = !(value instanceof Entity) ? value : value.asObject(shallow);

        return;
      }

      var asObjects = [];

      value.forEach(function (childValue) {
        if ((typeof childValue === 'undefined' ? 'undefined' : _typeof(childValue)) !== 'object') {
          return;
        }

        if (!(childValue instanceof Entity)) {
          asObjects.push(childValue);

          return;
        }

        if (!shallow || (typeof childValue === 'undefined' ? 'undefined' : _typeof(childValue)) === 'object' && !childValue.id) {
          asObjects.push(childValue.asObject(shallow));
        }
      });

      if (asObjects.length > 0) {
        pojo[propertyName] = asObjects;
      }
    });

    return pojo;
  }

  function _asJson(entity, shallow) {
    var json = void 0;

    try {
      json = JSON.stringify(_asObject(entity, shallow));
    } catch (error) {
      json = '';
    }

    return json;
  }

  function getCollectionsCompact(forEntity) {
    var associations = forEntity.getMeta().fetch('associations');
    var collections = {};

    Object.getOwnPropertyNames(associations).forEach(function (index) {
      var association = associations[index];

      if (association.type !== 'collection') {
        return;
      }

      collections[index] = [];

      if (!Array.isArray(forEntity[index])) {
        return;
      }

      forEntity[index].forEach(function (entity) {
        if (typeof entity === 'number') {
          collections[index].push(entity);

          return;
        }

        if (entity.id) {
          collections[index].push(entity.id);
        }
      });
    });

    return collections;
  }

  function getFlat(entity, json) {
    var flat = {
      entity: _asObject(entity, true),
      collections: getCollectionsCompact(entity)
    };

    if (json) {
      flat = JSON.stringify(flat);
    }

    return flat;
  }

  function getPropertyForAssociation(forEntity, entity) {
    var associations = forEntity.getMeta().fetch('associations');

    return Object.keys(associations).filter(function (key) {
      return associations[key].entity === entity.getResource();
    })[0];
  }
});