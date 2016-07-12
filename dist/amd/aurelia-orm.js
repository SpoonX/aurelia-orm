define(['exports', './default-repository', './repository', './entity', './orm-metadata', './decorator/association', './decorator/resource', './decorator/endpoint', './decorator/name', './decorator/repository', './decorator/validation', './decorator/type', './decorator/validated-resource', './decorator/data', 'typer', 'aurelia-dependency-injection', 'aurelia-api', 'aurelia-metadata', 'aurelia-validation', 'aurelia-logging', './component/association-select', './component/paged'], function (exports, _defaultRepository, _repository2, _entity, _ormMetadata, _association, _resource, _endpoint, _name, _repository3, _validation, _type, _validatedResource, _data, _typer, _aureliaDependencyInjection, _aureliaApi, _aureliaMetadata, _aureliaValidation, _aureliaLogging) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.logger = exports.ValidationGroup = exports.HasAssociationValidationRule = exports.data = exports.validatedResource = exports.type = exports.validation = exports.repository = exports.name = exports.endpoint = exports.resource = exports.association = exports.EntityManager = exports.Entity = exports.Metadata = exports.OrmMetadata = exports.DefaultRepository = exports.Repository = undefined;
  Object.defineProperty(exports, 'DefaultRepository', {
    enumerable: true,
    get: function () {
      return _defaultRepository.DefaultRepository;
    }
  });
  Object.defineProperty(exports, 'Repository', {
    enumerable: true,
    get: function () {
      return _repository2.Repository;
    }
  });
  Object.defineProperty(exports, 'Entity', {
    enumerable: true,
    get: function () {
      return _entity.Entity;
    }
  });
  Object.defineProperty(exports, 'OrmMetadata', {
    enumerable: true,
    get: function () {
      return _ormMetadata.OrmMetadata;
    }
  });
  Object.defineProperty(exports, 'association', {
    enumerable: true,
    get: function () {
      return _association.association;
    }
  });
  Object.defineProperty(exports, 'resource', {
    enumerable: true,
    get: function () {
      return _resource.resource;
    }
  });
  Object.defineProperty(exports, 'endpoint', {
    enumerable: true,
    get: function () {
      return _endpoint.endpoint;
    }
  });
  Object.defineProperty(exports, 'name', {
    enumerable: true,
    get: function () {
      return _name.name;
    }
  });
  Object.defineProperty(exports, 'repository', {
    enumerable: true,
    get: function () {
      return _repository3.repository;
    }
  });
  Object.defineProperty(exports, 'validation', {
    enumerable: true,
    get: function () {
      return _validation.validation;
    }
  });
  Object.defineProperty(exports, 'type', {
    enumerable: true,
    get: function () {
      return _type.type;
    }
  });
  Object.defineProperty(exports, 'validatedResource', {
    enumerable: true,
    get: function () {
      return _validatedResource.validatedResource;
    }
  });
  Object.defineProperty(exports, 'data', {
    enumerable: true,
    get: function () {
      return _data.data;
    }
  });
  exports.configure = configure;

  var _typer2 = _interopRequireDefault(_typer);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
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

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  

  var _dec, _class, _dec2, _class3, _class4, _temp, _dec3, _dec4, _class5, _dec5, _class6;

  var Repository = exports.Repository = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaApi.Config), _dec(_class = function () {
    function Repository(clientConfig) {
      

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
  }()) || _class);
  var DefaultRepository = exports.DefaultRepository = (_dec2 = (0, _aureliaDependencyInjection.transient)(), _dec2(_class3 = function (_Repository) {
    _inherits(DefaultRepository, _Repository);

    function DefaultRepository() {
      

      return _possibleConstructorReturn(this, _Repository.apply(this, arguments));
    }

    return DefaultRepository;
  }(Repository)) || _class3);

  var OrmMetadata = exports.OrmMetadata = function () {
    function OrmMetadata() {
      
    }

    OrmMetadata.forTarget = function forTarget(target) {
      return _aureliaMetadata.metadata.getOrCreateOwn(Metadata.key, Metadata, target, target.name);
    };

    return OrmMetadata;
  }();

  var Metadata = exports.Metadata = (_temp = _class4 = function () {
    function Metadata() {
      

      this.metadata = {
        repository: DefaultRepository,
        resource: null,
        endpoint: null,
        name: null,
        idProperty: 'id',
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
  }(), _class4.key = 'spoonx:orm:metadata', _temp);
  var Entity = exports.Entity = (_dec3 = (0, _aureliaDependencyInjection.transient)(), _dec4 = (0, _aureliaDependencyInjection.inject)(_aureliaValidation.Validation), _dec3(_class5 = _dec4(_class5 = function () {
    function Entity(validator) {
      

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

    Entity.prototype.getIdProperty = function getIdProperty() {
      return this.getMeta().fetch('idProperty');
    };

    Entity.getIdProperty = function getIdProperty() {
      var idProperty = OrmMetadata.forTarget(this).fetch('idProperty');

      return idProperty;
    };

    Entity.prototype.getId = function getId() {
      return this[this.getIdProperty()];
    };

    Entity.prototype.setId = function setId(id) {
      this[this.getIdProperty()] = id;

      return this;
    };

    Entity.prototype.save = function save() {
      var _this4 = this;

      if (!this.isNew()) {
        return this.update();
      }

      var response = void 0;
      return this.getTransport().create(this.getResource(), this.asObject(true)).then(function (created) {
        _this4.setId(created[_this4.getIdProperty()]);
        response = created;
      }).then(function () {
        return _this4.saveCollections();
      }).then(function () {
        return _this4.markClean();
      }).then(function () {
        return response;
      });
    };

    Entity.prototype.update = function update() {
      var _this5 = this;

      if (this.isNew()) {
        throw new Error('Required value "id" missing on entity.');
      }

      if (this.isClean()) {
        return this.saveCollections().then(function () {
          return _this5.markClean();
        }).then(function () {
          return null;
        });
      }

      var requestBody = this.asObject(true);
      var response = void 0;

      delete requestBody[this.getIdProperty()];

      return this.getTransport().update(this.getResource(), this.getId(), requestBody).then(function (updated) {
        return response = updated;
      }).then(function () {
        return _this5.saveCollections();
      }).then(function () {
        return _this5.markClean();
      }).then(function () {
        return response;
      });
    };

    Entity.prototype.addCollectionAssociation = function addCollectionAssociation(entity, property) {
      var _this6 = this;

      property = property || getPropertyForAssociation(this, entity);
      var url = [this.getResource(), this.getId(), property];

      if (this.isNew()) {
        throw new Error('Cannot add association to entity that does not have an id.');
      }

      if (!(entity instanceof Entity)) {
        url.push(entity);

        return this.getTransport().create(url.join('/'));
      }

      if (entity.isNew()) {
        var associationProperty = getPropertyForAssociation(entity, this);
        var relation = entity.getMeta().fetch('association', associationProperty);

        if (!relation || relation.type !== 'entity') {
          return entity.save().then(function () {
            if (entity.isNew()) {
              throw new Error('Entity did not return return an id on saving.');
            }

            return _this6.addCollectionAssociation(entity, property);
          });
        }

        entity[associationProperty] = this.getId();

        return entity.save().then(function () {
          return entity;
        });
      }

      url.push(entity.getId());

      return this.getTransport().create(url.join('/')).then(function () {
        return entity;
      });
    };

    Entity.prototype.removeCollectionAssociation = function removeCollectionAssociation(entity, property) {
      property = property || getPropertyForAssociation(this, entity);
      var idToRemove = entity;

      if (entity instanceof Entity) {
        if (!entity.getId()) {
          return Promise.resolve(null);
        }

        idToRemove = entity.getId();
      }

      return this.getTransport().destroy([this.getResource(), this.getId(), property, idToRemove].join('/'));
    };

    Entity.prototype.saveCollections = function saveCollections() {
      var _this7 = this;

      var tasks = [];
      var currentCollections = getCollectionsCompact(this, true);
      var cleanCollections = this.__cleanValues.data ? this.__cleanValues.data.collections : null;

      var addTasksForDifferences = function addTasksForDifferences(base, candidate, method) {
        if (base === null) {
          return;
        }

        Object.getOwnPropertyNames(base).forEach(function (property) {
          base[property].forEach(function (id) {
            if (candidate === null || !Array.isArray(candidate[property]) || candidate[property].indexOf(id) === -1) {
              tasks.push(method.call(_this7, id, property));
            }
          });
        });
      };

      addTasksForDifferences(currentCollections, cleanCollections, this.addCollectionAssociation);

      addTasksForDifferences(cleanCollections, currentCollections, this.removeCollectionAssociation);

      return Promise.all(tasks).then(function (results) {
        return _this7;
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
      return typeof this.getId() === 'undefined';
    };

    Entity.prototype.reset = function reset(shallow) {
      var _this8 = this;

      var pojo = {};
      var metadata = this.getMeta();

      Object.keys(this).forEach(function (propertyName) {
        var value = _this8[propertyName];
        var association = metadata.fetch('associations', propertyName);

        if (!association || !value) {
          pojo[propertyName] = value;

          return;
        }
      });

      if (this.isClean()) {
        return this;
      }

      var isNew = this.isNew();
      var associations = this.getMeta().fetch('associations');

      Object.keys(this).forEach(function (propertyName) {
        if (Object.getOwnPropertyNames(associations).indexOf(propertyName) === -1) {
          delete _this8[propertyName];
        }
      });

      if (isNew) {
        return this.markClean();
      }

      this.setData(this.__cleanValues.data.entity);

      if (shallow) {
        return this.markClean();
      }

      var collections = this.__cleanValues.data.collections;

      Object.getOwnPropertyNames(collections).forEach(function (index) {
        _this8[index] = [];
        collections[index].forEach(function (entity) {
          if (typeof entity === 'number') {
            _this8[index].push(entity);
          }
        });
      });

      return this.markClean();
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
      if (!this.getId()) {
        throw new Error('Required value "id" missing on entity.');
      }

      return this.getTransport().destroy(this.getResource(), this.getId());
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

    Entity.prototype.setData = function setData(data, markClean) {
      Object.assign(this, data);

      if (markClean) {
        this.markClean();
      }

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
  }()) || _class5) || _class5);

  function _asObject(entity, shallow) {
    var pojo = {};
    var metadata = entity.getMeta();

    Object.keys(entity).forEach(function (propertyName) {
      var value = entity[propertyName];
      var association = metadata.fetch('associations', propertyName);

      if (!association || !value) {
        pojo[propertyName] = value;

        return;
      }

      if (shallow) {
        if (association.type === 'collection') {
          return;
        }

        if (value instanceof Entity && value.getId()) {
          pojo[propertyName] = value.getId();

          return;
        }

        if (value instanceof Entity) {
          pojo[propertyName] = value.asObject();

          return;
        }

        if (['string', 'number', 'boolean'].indexOf(typeof value === 'undefined' ? 'undefined' : _typeof(value)) > -1 || value.constructor === Object) {
          pojo[propertyName] = value;

          return;
        }
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

        if (!shallow || (typeof childValue === 'undefined' ? 'undefined' : _typeof(childValue)) === 'object' && !childValue.getId()) {
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

  function getCollectionsCompact(forEntity, includeNew) {
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

        if (!(entity instanceof Entity)) {
          return;
        }

        if (entity.getId()) {
          collections[index].push(entity.getId());

          return;
        }

        if (includeNew) {
          collections[index].push(entity);

          return;
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

  var EntityManager = exports.EntityManager = (_dec5 = (0, _aureliaDependencyInjection.inject)(_aureliaDependencyInjection.Container), _dec5(_class6 = function () {
    function EntityManager(container) {
      

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
  }()) || _class6);
  function configure(aurelia, configCallback) {
    var entityManagerInstance = aurelia.container.get(EntityManager);

    configCallback(entityManagerInstance);

    _aureliaValidation.ValidationGroup.prototype.hasAssociation = function () {
      return this.isNotEmpty().passesRule(new HasAssociationValidationRule());
    };

    aurelia.globalResources('./component/association-select');
    aurelia.globalResources('./component/paged');
  }

  var logger = (0, _aureliaLogging.getLogger)('aurelia-orm');

  exports.EntityManager = EntityManager;
  exports.HasAssociationValidationRule = HasAssociationValidationRule;
  exports.ValidationGroup = _aureliaValidation.ValidationGroup;
  exports.logger = logger;
});