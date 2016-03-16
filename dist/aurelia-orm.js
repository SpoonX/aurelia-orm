'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HasAssociationValidationRule = exports.AssociationSelect = exports.Repository = exports.Metadata = exports.OrmMetadata = exports.Entity = exports.EntityManager = exports.DefaultRepository = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _dec, _class, _dec2, _class2, _dec3, _dec4, _class4, _class5, _temp, _dec5, _class6, _dec6, _dec7, _dec8, _class8, _desc, _value, _class9, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;

exports.association = association;
exports.endpoint = endpoint;
exports.name = name;
exports.repository = repository;
exports.resource = resource;
exports.type = type;
exports.validatedResource = validatedResource;
exports.validation = validation;

var _typer = require('typer');

var _typer2 = _interopRequireDefault(_typer);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaValidation = require('aurelia-validation');

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaApi = require('spoonx/aurelia-api');

var _aureliaBinding = require('aurelia-binding');

var _aureliaTemplating = require('aurelia-templating');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DefaultRepository = exports.DefaultRepository = (_dec = (0, _aureliaDependencyInjection.transient)(), _dec(_class = function (_Repository) {
  _inherits(DefaultRepository, _Repository);

  function DefaultRepository() {
    _classCallCheck(this, DefaultRepository);

    return _possibleConstructorReturn(this, _Repository.apply(this, arguments));
  }

  return DefaultRepository;
}(Repository)) || _class);
var EntityManager = exports.EntityManager = (_dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaDependencyInjection.Container), _dec2(_class2 = function () {
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
}()) || _class2);
var Entity = exports.Entity = (_dec3 = (0, _aureliaDependencyInjection.transient)(), _dec4 = (0, _aureliaDependencyInjection.inject)(_aureliaValidation.Validation), _dec3(_class4 = _dec4(_class4 = function () {
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
}()) || _class4) || _class4);

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

var OrmMetadata = exports.OrmMetadata = function () {
  function OrmMetadata() {
    _classCallCheck(this, OrmMetadata);
  }

  OrmMetadata.forTarget = function forTarget(target) {
    return _aureliaMetadata.metadata.getOrCreateOwn(Metadata.key, Metadata, target);
  };

  return OrmMetadata;
}();

var Metadata = exports.Metadata = (_temp = _class5 = function () {
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
}(), _class5.key = 'spoonx:orm:metadata', _temp);
var Repository = exports.Repository = (_dec5 = (0, _aureliaDependencyInjection.inject)(_aureliaApi.Config), _dec5(_class6 = function () {
  function Repository(clientConfig) {
    _classCallCheck(this, Repository);

    this.transport = null;

    this.clientConfig = clientConfig;
  }

  Repository.prototype.getTransport = function getTransport() {
    if (this.transport === null) {
      this.transport = this.clientConfig.getEndpoint(this.getMeta().fetch('endpoint'));
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
}()) || _class6);
var AssociationSelect = exports.AssociationSelect = (_dec6 = (0, _aureliaTemplating.customElement)('association-select'), _dec7 = (0, _aureliaDependencyInjection.inject)(_aureliaBinding.BindingEngine, EntityManager, Element), _dec8 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.twoWay }), _dec6(_class8 = _dec7(_class8 = (_class9 = function () {
  function AssociationSelect(bindingEngine, entityManager, element) {
    _classCallCheck(this, AssociationSelect);

    _initDefineProp(this, 'criteria', _descriptor, this);

    _initDefineProp(this, 'repository', _descriptor2, this);

    _initDefineProp(this, 'property', _descriptor3, this);

    _initDefineProp(this, 'options', _descriptor4, this);

    _initDefineProp(this, 'association', _descriptor5, this);

    _initDefineProp(this, 'manyAssociation', _descriptor6, this);

    _initDefineProp(this, 'value', _descriptor7, this);

    this.multiple = false;

    this._subscriptions = [];
    this.bindingEngine = bindingEngine;
    this.entityManager = entityManager;
    this.multiple = typeof element.getAttribute('multiple') === 'string';
  }

  AssociationSelect.prototype.load = function load(reservedValue) {
    var _this7 = this;

    return this.buildFind().then(function (options) {
      var result = options;
      _this7.options = Array.isArray(result) ? result : [result];

      _this7.setValue(reservedValue);
    });
  };

  AssociationSelect.prototype.setValue = function setValue(value) {
    if (!value) {
      return;
    }

    if (!Array.isArray(value)) {
      this.value = value;

      return;
    }

    var selectedValues = [];

    value.forEach(function (selected) {
      selectedValues.push(selected instanceof Entity ? selected.id : selected);
    });

    this.value = selectedValues;
  };

  AssociationSelect.prototype.getCriteria = function getCriteria() {
    if (_typeof(this.criteria) !== 'object') {
      return {};
    }

    return (0, _extend2.default)(true, {}, this.criteria);
  };

  AssociationSelect.prototype.buildFind = function buildFind() {
    var _this8 = this;

    var repository = this.repository;
    var criteria = this.getCriteria();
    var findPath = repository.getResource();
    criteria.populate = false;

    if (this.manyAssociation) {
      var assoc = this.manyAssociation;

      delete criteria.populate;

      var property = this.propertyForResource(assoc.getMeta(), repository.getResource());
      findPath = assoc.getResource() + '/' + assoc.id + '/' + property;
    } else if (this.association) {
      var associations = Array.isArray(this.association) ? this.association : [this.association];

      associations.forEach(function (association) {
        criteria[_this8.propertyForResource(_this8.ownMeta, association.getResource())] = association.id;
      });
    }

    return repository.findPath(findPath, criteria);
  };

  AssociationSelect.prototype.verifyAssociationValues = function verifyAssociationValues() {
    if (this.manyAssociation) {
      return !!this.manyAssociation.id;
    }

    if (this.association) {
      var associations = Array.isArray(this.association) ? this.association : [this.association];

      return !associations.some(function (association) {
        return !association.id;
      });
    }

    return true;
  };

  AssociationSelect.prototype.observe = function observe(association) {
    var _this9 = this;

    if (Array.isArray(association)) {
      association.forEach(function (assoc) {
        return _this9.observe(assoc);
      });

      return this;
    }

    this._subscriptions.push(this.bindingEngine.propertyObserver(association, 'id').subscribe(function () {
      if (_this9.verifyAssociationValues()) {
        return _this9.load();
      }

      _this9.options = undefined;
    }));

    return this;
  };

  AssociationSelect.prototype.attached = function attached() {
    if (!this.association && !this.manyAssociation) {
      this.load(this.value);

      return;
    }

    this.ownMeta = OrmMetadata.forTarget(this.entityManager.resolveEntityReference(this.repository.getResource()));

    if (this.manyAssociation) {
      this.observe(this.manyAssociation);
    }

    if (this.association) {
      this.observe(this.association);
    }

    if (this.value) {
      this.load(this.value);
    }
  };

  AssociationSelect.prototype.propertyForResource = function propertyForResource(meta, resource) {
    var associations = meta.fetch('associations');

    return Object.keys(associations).filter(function (key) {
      return associations[key].entity === resource;
    })[0];
  };

  AssociationSelect.prototype.unbind = function unbind() {
    this._subscriptions.forEach(function (subscription) {
      return subscription.dispose();
    });
  };

  return AssociationSelect;
}(), (_descriptor = _applyDecoratedDescriptor(_class9.prototype, 'criteria', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class9.prototype, 'repository', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class9.prototype, 'property', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return 'name';
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class9.prototype, 'options', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class9.prototype, 'association', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class9.prototype, 'manyAssociation', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class9.prototype, 'value', [_dec8], {
  enumerable: true,
  initializer: null
})), _class9)) || _class8) || _class8);
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

function endpoint(entityEndpoint) {
  return function (target) {
    OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
  };
}

function name(entityName) {
  return function (target) {
    OrmMetadata.forTarget(target).put('name', entityName || target.name.toLowerCase());
  };
}

function repository(repositoryReference) {
  return function (target) {
    OrmMetadata.forTarget(target).put('repository', repositoryReference);
  };
}

function resource(resourceName) {
  return function (target) {
    OrmMetadata.forTarget(target).put('resource', resourceName || target.name.toLowerCase());
  };
}

function type(typeValue) {
  return function (target, propertyName) {
    OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
  };
}

function validatedResource(resourceName) {
  return function (target, propertyName) {
    resource(resourceName)(target);
    validation()(target, propertyName);
  };
}

function validation() {
  return function (target) {
    OrmMetadata.forTarget(target).put('validation', true);
  };
}

var HasAssociationValidationRule = exports.HasAssociationValidationRule = function (_ValidationRule) {
  _inherits(HasAssociationValidationRule, _ValidationRule);

  function HasAssociationValidationRule() {
    _classCallCheck(this, HasAssociationValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule.call(this, null, function (value) {
      return !!(value instanceof Entity && typeof value.id === 'number' || typeof value === 'number');
    }, null, 'isRequired'));
  }

  return HasAssociationValidationRule;
}(_aureliaValidation.ValidationRule);