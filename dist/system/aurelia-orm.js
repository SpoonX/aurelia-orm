'use strict';

System.register(['typer', 'aurelia-validation', 'aurelia-dependency-injection', 'aurelia-metadata', 'aurelia-api', './component/association-select'], function (_export, _context) {
  var typer, ValidationGroup, Validation, ValidationRule, transient, Container, inject, metadata, Config, _typeof, _dec, _class, _dec2, _class2, _dec3, _dec4, _class4, _class5, _temp, _dec5, _class6, DefaultRepository, EntityManager, Entity, OrmMetadata, Metadata, Repository, HasAssociationValidationRule;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function configure(aurelia, configCallback) {
    var entityManagerInstance = aurelia.container.get(EntityManager);

    configCallback(entityManagerInstance);

    ValidationGroup.prototype.hasAssociation = function () {
      return this.isNotEmpty().passesRule(new HasAssociationValidationRule());
    };

    aurelia.globalResources('./component/association-select');
  }

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

  return {
    setters: [function (_typer) {
      typer = _typer.default;
    }, function (_aureliaValidation) {
      ValidationGroup = _aureliaValidation.ValidationGroup;
      Validation = _aureliaValidation.Validation;
      ValidationRule = _aureliaValidation.ValidationRule;
    }, function (_aureliaDependencyInjection) {
      transient = _aureliaDependencyInjection.transient;
      Container = _aureliaDependencyInjection.Container;
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaMetadata) {
      metadata = _aureliaMetadata.metadata;
    }, function (_aureliaApi) {
      Config = _aureliaApi.Config;
    }, function (_componentAssociationSelect) {}],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
      };

      _export('configure', configure);

      _export('DefaultRepository', DefaultRepository);

      _export('Repository', Repository);

      _export('Entity', Entity);

      _export('OrmMetadata', OrmMetadata);

      _export('EntityManager', EntityManager);

      _export('association', association);

      _export('resource', resource);

      _export('endpoint', endpoint);

      _export('name', name);

      _export('repository', repository);

      _export('validation', validation);

      _export('type', type);

      _export('validatedResource', validatedResource);

      _export('DefaultRepository', _export('DefaultRepository', DefaultRepository = (_dec = transient(), _dec(_class = function (_Repository) {
        _inherits(DefaultRepository, _Repository);

        function DefaultRepository() {
          _classCallCheck(this, DefaultRepository);

          return _possibleConstructorReturn(this, _Repository.apply(this, arguments));
        }

        return DefaultRepository;
      }(Repository)) || _class)));

      _export('DefaultRepository', DefaultRepository);

      _export('EntityManager', _export('EntityManager', EntityManager = (_dec2 = inject(Container), _dec2(_class2 = function () {
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
      }()) || _class2)));

      _export('EntityManager', EntityManager);

      _export('Entity', _export('Entity', Entity = (_dec3 = transient(), _dec4 = inject(Validation), _dec3(_class4 = _dec4(_class4 = function () {
        function Entity(validator) {
          _classCallCheck(this, Entity);

          this.define('__meta', OrmMetadata.forTarget(this.constructor)).define('__cleanValues', {}, true);

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
          var _this2 = this;

          if (!this.isNew()) {
            return this.update();
          }

          var response = void 0;
          return this.getTransport().create(this.getResource(), this.asObject(true)).then(function (created) {
            _this2.id = created.id;
            response = created;
          }).then(function () {
            return _this2.saveCollections();
          }).then(function () {
            return _this2.markClean();
          }).then(function () {
            return response;
          });
        };

        Entity.prototype.update = function update() {
          var _this3 = this;

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
            return _this3.saveCollections();
          }).then(function () {
            return _this3.markClean();
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
          var _this4 = this;

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
                  tasks.push(method.call(_this4, id, property));
                }
              });
            });
          };

          addTasksForDifferences(currentCollections, cleanCollections, this.addCollectionAssociation);

          addTasksForDifferences(cleanCollections, currentCollections, this.removeCollectionAssociation);

          return Promise.all(tasks).then(function (results) {
            if (!Array.isArray(results)) {
              return _this4;
            }

            var newState = null;

            while (newState === null) {
              newState = results.pop();
            }

            if (newState) {
              _this4.getRepository().getPopulatedEntity(newState, _this4);
            }

            return _this4;
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
          return OrmMetadata.forTarget(this).fetch('resource');
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
          var metaName = OrmMetadata.forTarget(this).fetch('name');

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
      }()) || _class4) || _class4)));

      _export('Entity', Entity);

      _export('OrmMetadata', _export('OrmMetadata', OrmMetadata = function () {
        function OrmMetadata() {
          _classCallCheck(this, OrmMetadata);
        }

        OrmMetadata.forTarget = function forTarget(target) {
          return metadata.getOrCreateOwn(Metadata.key, Metadata, target);
        };

        return OrmMetadata;
      }()));

      _export('OrmMetadata', OrmMetadata);

      _export('Metadata', Metadata = (_temp = _class5 = function () {
        function Metadata() {
          _classCallCheck(this, Metadata);

          this.metadata = {
            repository: DefaultRepository,
            resource: null,
            endpoint: null,
            name: null,
            associations: {}
          };
        }

        Metadata.prototype.addTo = function addTo(key, value) {
          if (typeof this.metadata[key] === 'undefined') {
            this.metadata[key] = [];
          } else if (!Array.isArray(this.metadata[key])) {
            this.metadata[key] = [this.metadata[key]];
          }

          this.metadata[key].push(value);

          return this;
        };

        Metadata.prototype.put = function put(key, valueOrNestedKey, valueOrNull) {
          if (!valueOrNull) {
            this.metadata[key] = valueOrNestedKey;

            return this;
          }

          if (_typeof(this.metadata[key]) !== 'object') {
            this.metadata[key] = {};
          }

          this.metadata[key][valueOrNestedKey] = valueOrNull;

          return this;
        };

        Metadata.prototype.has = function has(key, nested) {
          if (typeof nested === 'undefined') {
            return typeof this.metadata[key] !== 'undefined';
          }

          return typeof this.metadata[key] !== 'undefined' && typeof this.metadata[key][nested] !== 'undefined';
        };

        Metadata.prototype.fetch = function fetch(key, nested) {
          if (!nested) {
            return this.has(key) ? this.metadata[key] : null;
          }

          if (!this.has(key, nested)) {
            return null;
          }

          return this.metadata[key][nested];
        };

        return Metadata;
      }(), _class5.key = 'spoonx:orm:metadata', _temp));

      _export('Metadata', Metadata);

      _export('Repository', _export('Repository', Repository = (_dec5 = inject(Config), _dec5(_class6 = function () {
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
          var _this5 = this;

          var findQuery = this.getTransport().find(path, criteria);

          if (raw) {
            return findQuery;
          }

          return findQuery.then(function (x) {
            return _this5.populateEntities(x);
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
          var _this6 = this;

          if (!data) {
            return null;
          }

          if (!Array.isArray(data)) {
            return this.getPopulatedEntity(data);
          }

          var collection = [];

          data.forEach(function (source) {
            collection.push(_this6.getPopulatedEntity(source));
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
              populatedData[key] = typer.cast(value, entityMetadata.fetch('types', key));

              continue;
            }

            if (!entityMetadata.has('associations', key) || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
              populatedData[key] = value;

              continue;
            }

            var _repository = this.entityManager.getRepository(entityMetadata.fetch('associations', key).entity);
            populatedData[key] = _repository.populateEntities(value);
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
      }()) || _class6)));

      _export('Repository', Repository);

      function association(associationData) {
        return function (target, propertyName) {
          if (!associationData) {
            associationData = { entity: propertyName };
          } else if (typeof associationData === 'string') {
            associationData = { entity: associationData };
          }

          OrmMetadata.forTarget(target.constructor).put('associations', propertyName, {
            type: associationData.entity ? 'entity' : 'collection',
            entity: associationData.entity || associationData.collection
          });
        };
      }

      _export('association', association);

      function endpoint(entityEndpoint) {
        return function (target) {
          OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
        };
      }

      _export('endpoint', endpoint);

      function name(entityName) {
        return function (target) {
          OrmMetadata.forTarget(target).put('name', entityName || target.name.toLowerCase());
        };
      }

      _export('name', name);

      function repository(repositoryReference) {
        return function (target) {
          OrmMetadata.forTarget(target).put('repository', repositoryReference);
        };
      }

      _export('repository', repository);

      function resource(resourceName) {
        return function (target) {
          OrmMetadata.forTarget(target).put('resource', resourceName || target.name.toLowerCase());
        };
      }

      _export('resource', resource);

      function type(typeValue) {
        return function (target, propertyName) {
          OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
        };
      }

      _export('type', type);

      function validatedResource(resourceName) {
        return function (target, propertyName) {
          resource(resourceName)(target);
          validation()(target, propertyName);
        };
      }

      _export('validatedResource', validatedResource);

      function validation() {
        return function (target) {
          OrmMetadata.forTarget(target).put('validation', true);
        };
      }

      _export('validation', validation);

      _export('HasAssociationValidationRule', HasAssociationValidationRule = function (_ValidationRule) {
        _inherits(HasAssociationValidationRule, _ValidationRule);

        function HasAssociationValidationRule() {
          _classCallCheck(this, HasAssociationValidationRule);

          return _possibleConstructorReturn(this, _ValidationRule.call(this, null, function (value) {
            return !!(value instanceof Entity && typeof value.id === 'number' || typeof value === 'number');
          }, null, 'isRequired'));
        }

        return HasAssociationValidationRule;
      }(ValidationRule));

      _export('HasAssociationValidationRule', HasAssociationValidationRule);
    }
  };
});