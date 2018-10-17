var _dec, _class, _dec2, _class3, _class4, _temp, _dec3, _class5, _dec4, _class6;

import typer from 'typer';
import { inject, transient, Container } from 'aurelia-dependency-injection';
import { Config } from 'aurelia-api';
import { metadata } from 'aurelia-metadata';
import { Validator, ValidationRules } from 'aurelia-validation';
import { getLogger } from 'aurelia-logging';
import { Config as ViewManagerConfig } from 'aurelia-view-manager';

export let Repository = (_dec = inject(Config), _dec(_class = class Repository {
  constructor(clientConfig) {
    this.transport = null;

    this.clientConfig = clientConfig;
  }

  getTransport() {
    if (this.transport === null) {
      this.transport = this.clientConfig.getEndpoint(this.getMeta().fetch('endpoint'));

      if (!this.transport) {
        throw new Error(`No transport found for '${this.getMeta().fetch('endpoint') || 'default'}'.`);
      }
    }

    return this.transport;
  }

  setMeta(meta) {
    this.meta = meta;
  }

  getMeta() {
    return this.meta;
  }

  setIdentifier(identifier) {
    this.identifier = identifier;

    return this;
  }

  getIdentifier() {
    return this.identifier;
  }

  setResource(resource) {
    this.resource = resource;

    return this;
  }

  getResource() {
    return this.resource;
  }

  find(criteria, raw) {
    return this.findPath(this.resource, criteria, raw);
  }

  findOne(criteria, raw) {
    return this.findPath(this.resource, criteria, raw, true);
  }

  findPath(path, criteria, raw, single) {
    let transport = this.getTransport();
    let findQuery;

    if (single) {
      if (typeof criteria === 'object' && criteria !== null) {
        criteria.limit = 1;
      }

      findQuery = transport.findOne(path, criteria);
    } else {
      findQuery = transport.find(path, criteria);
    }

    if (raw) {
      return findQuery;
    }

    return findQuery.then(response => {
      return this.populateEntities(response);
    }).then(populated => {
      if (!populated) {
        return null;
      }

      if (!Array.isArray(populated)) {
        return populated.markClean();
      }

      populated.forEach(entity => entity.markClean());

      return populated;
    });
  }

  count(criteria) {
    return this.getTransport().find(this.resource + '/count', criteria);
  }

  populateEntities(data, clean) {
    if (!data) {
      return null;
    }

    if (!Array.isArray(data)) {
      return this.getPopulatedEntity(data, null, clean);
    }

    let collection = [];

    data.forEach(source => {
      collection.push(this.getPopulatedEntity(source, null, clean));
    });

    return collection;
  }

  getPopulatedEntity(data, entity, clean) {
    entity = entity || this.getNewEntity();
    let entityMetadata = entity.getMeta();
    let populatedData = {};
    let key;

    for (key in data) {
      if (!data.hasOwnProperty(key)) {
        continue;
      }

      let value = data[key];

      if (entityMetadata.has('types', key)) {
        const dataType = entityMetadata.fetch('types', key);

        if ((dataType === 'date' || dataType === 'datetime') && !value) {
          continue;
        }

        populatedData[key] = typer.cast(value, dataType);

        continue;
      }

      if (!entityMetadata.has('associations', key) || typeof value !== 'object') {
        populatedData[key] = value;

        continue;
      }

      let repository = this.entityManager.getRepository(entityMetadata.fetch('associations', key).entity);

      populatedData[key] = repository.populateEntities(value, clean);
    }

    return entity.setData(populatedData, clean);
  }

  getNewEntity() {
    return this.entityManager.getEntity(this.identifier || this.resource);
  }

  getNewPopulatedEntity() {
    let entity = this.getNewEntity();
    let associations = entity.getMeta().fetch('associations');

    for (let property in associations) {
      if (associations.hasOwnProperty(property)) {
        let assocMeta = associations[property];

        if (assocMeta.type !== 'entity') {
          continue;
        }

        entity[property] = this.entityManager.getRepository(assocMeta.entity).getNewEntity();
      }
    }

    return entity;
  }
}) || _class);

export let DefaultRepository = (_dec2 = transient(), _dec2(_class3 = class DefaultRepository extends Repository {}) || _class3);

export let OrmMetadata = class OrmMetadata {
  static forTarget(target) {
    return metadata.getOrCreateOwn(Metadata.key, Metadata, target, target.name);
  }
};

export let Metadata = (_temp = _class4 = class Metadata {
  constructor() {
    this.metadata = {
      repository: DefaultRepository,
      identifier: null,
      resource: null,
      endpoint: null,
      name: null,
      idProperty: 'id',
      associations: {}
    };
  }

  addTo(key, value) {
    if (typeof this.metadata[key] === 'undefined') {
      this.metadata[key] = [];
    } else if (!Array.isArray(this.metadata[key])) {
      this.metadata[key] = [this.metadata[key]];
    }

    this.metadata[key].push(value);

    return this;
  }

  put(key, valueOrNestedKey, valueOrNull) {
    if (!valueOrNull) {
      this.metadata[key] = valueOrNestedKey;

      return this;
    }

    if (typeof this.metadata[key] !== 'object') {
      this.metadata[key] = {};
    }

    this.metadata[key][valueOrNestedKey] = valueOrNull;

    return this;
  }

  has(key, nested) {
    if (typeof nested === 'undefined') {
      return typeof this.metadata[key] !== 'undefined';
    }

    return typeof this.metadata[key] !== 'undefined' && typeof this.metadata[key][nested] !== 'undefined';
  }

  fetch(key, nested) {
    if (!nested) {
      return this.has(key) ? this.metadata[key] : null;
    }

    if (!this.has(key, nested)) {
      return null;
    }

    return this.metadata[key][nested];
  }
}, _class4.key = 'spoonx:orm:metadata', _temp);

export let Entity = (_dec3 = transient(), _dec3(_class5 = class Entity {
  constructor() {
    this.define('__meta', OrmMetadata.forTarget(this.constructor)).define('__cleanValues', {}, true);
  }

  getTransport() {
    return this.getRepository().getTransport();
  }

  getRepository() {
    return this.__repository;
  }

  setRepository(repository) {
    return this.define('__repository', repository);
  }

  define(property, value, writable) {
    Object.defineProperty(this, property, {
      value: value,
      writable: !!writable,
      enumerable: false
    });

    return this;
  }

  getMeta() {
    return this.__meta;
  }

  getIdProperty() {
    return this.getMeta().fetch('idProperty');
  }

  static getIdProperty() {
    let idProperty = OrmMetadata.forTarget(this).fetch('idProperty');

    return idProperty;
  }

  getId() {
    return this[this.getIdProperty()];
  }

  setId(id) {
    this[this.getIdProperty()] = id;

    return this;
  }

  save() {
    if (!this.isNew()) {
      return this.update();
    }

    let response;

    return this.getTransport().create(this.getResource(), this.asObject(true)).then(created => {
      this.setId(created[this.getIdProperty()]);
      response = created;
    }).then(() => this.saveCollections()).then(() => this.markClean()).then(() => response);
  }

  update() {
    if (this.isNew()) {
      throw new Error('Required value "id" missing on entity.');
    }

    if (this.isClean()) {
      return this.saveCollections().then(() => this.markClean()).then(() => null);
    }

    let requestBody = this.asObject(true);
    let response;

    return this.getTransport().update(this.getResource(), this.getId(), requestBody).then(updated => {
      response = updated;
    }).then(() => this.saveCollections()).then(() => this.markClean()).then(() => response);
  }

  addCollectionAssociation(entity, property) {
    property = property || getPropertyForAssociation(this, entity);
    let url = [this.getResource(), this.getId(), property];

    if (this.isNew()) {
      throw new Error('Cannot add association to entity that does not have an id.');
    }

    if (!(entity instanceof Entity)) {
      url.push(entity);

      return this.getTransport().create(url.join('/'));
    }

    if (entity.isNew()) {
      let associationProperty = getPropertyForAssociation(entity, this);
      let relation = entity.getMeta().fetch('association', associationProperty);

      if (!relation || relation.type !== 'entity') {
        return entity.save().then(() => {
          if (entity.isNew()) {
            throw new Error('Entity did not return return an id on saving.');
          }

          return this.addCollectionAssociation(entity, property);
        });
      }

      entity[associationProperty] = this.getId();

      return entity.save().then(() => entity);
    }

    url.push(entity.getId());

    return this.getTransport().create(url.join('/')).then(() => entity);
  }

  removeCollectionAssociation(entity, property) {
    property = property || getPropertyForAssociation(this, entity);
    let idToRemove = entity;

    if (entity instanceof Entity) {
      if (!entity.getId()) {
        return Promise.resolve(null);
      }

      idToRemove = entity.getId();
    }

    return this.getTransport().destroy([this.getResource(), this.getId(), property, idToRemove].join('/'));
  }

  saveCollections() {
    let tasks = [];
    let currentCollections = getCollectionsCompact(this, true);
    let cleanCollections = this.__cleanValues.data ? this.__cleanValues.data.collections : null;

    let addTasksForDifferences = (base, candidate, method) => {
      if (base === null) {
        return;
      }

      Object.getOwnPropertyNames(base).forEach(property => {
        base[property].forEach(id => {
          if (candidate === null || !Array.isArray(candidate[property]) || candidate[property].indexOf(id) === -1) {
            tasks.push(method.call(this, id, property));
          }
        });
      });
    };

    addTasksForDifferences(currentCollections, cleanCollections, this.addCollectionAssociation);

    addTasksForDifferences(cleanCollections, currentCollections, this.removeCollectionAssociation);

    return Promise.all(tasks).then(results => this);
  }

  markClean() {
    let cleanValues = getFlat(this);

    this.__cleanValues = {
      checksum: JSON.stringify(cleanValues),
      data: cleanValues
    };

    return this;
  }

  isClean() {
    return getFlat(this, true) === this.__cleanValues.checksum;
  }

  isDirty() {
    return !this.isClean();
  }

  isNew() {
    return !this.getId();
  }

  reset(shallow) {
    let pojo = {};
    let metadata = this.getMeta();

    Object.keys(this).forEach(propertyName => {
      let value = this[propertyName];
      let association = metadata.fetch('associations', propertyName);

      if (!association || !value) {
        pojo[propertyName] = value;

        return;
      }
    });

    if (this.isClean()) {
      return this;
    }

    let isNew = this.isNew();
    let associations = this.getMeta().fetch('associations');

    Object.keys(this).forEach(propertyName => {
      if (Object.getOwnPropertyNames(associations).indexOf(propertyName) === -1) {
        delete this[propertyName];
      }
    });

    if (isNew) {
      return this.markClean();
    }

    this.setData(this.__cleanValues.data.entity);

    if (shallow) {
      return this.markClean();
    }

    let collections = this.__cleanValues.data.collections;

    Object.getOwnPropertyNames(collections).forEach(index => {
      this[index] = [];
      collections[index].forEach(entity => {
        if (typeof entity === 'number') {
          this[index].push(entity);
        }
      });
    });

    return this.markClean();
  }

  clear() {
    if (!this.isNew()) {
      return this.setData(this.__cleanValues.data.entity);
    }

    return this;
  }

  static getIdentifier() {
    return OrmMetadata.forTarget(this).fetch('identifier');
  }

  getIdentifier() {
    return this.__identifier || this.getMeta().fetch('identifier');
  }

  setIdentifier(identifier) {
    return this.define('__identifier', identifier);
  }

  static getResource() {
    return OrmMetadata.forTarget(this).fetch('resource');
  }

  getResource() {
    return this.__resource || this.getMeta().fetch('resource');
  }

  setResource(resource) {
    return this.define('__resource', resource);
  }

  destroy() {
    if (!this.getId()) {
      throw new Error('Required value "id" missing on entity.');
    }

    return this.getTransport().destroy(this.getResource(), this.getId());
  }

  getName() {
    let metaName = this.getMeta().fetch('name');

    if (metaName) {
      return metaName;
    }

    return this.getResource();
  }

  static getName() {
    let metaName = OrmMetadata.forTarget(this).fetch('name');

    if (metaName) {
      return metaName;
    }

    return this.getResource();
  }

  setData(data, markClean) {
    Object.assign(this, data);

    if (markClean) {
      this.markClean();
    }

    return this;
  }

  setValidator(validator) {
    this.define('__validator', validator);

    return this;
  }

  getValidator() {
    if (!this.hasValidation()) {
      return null;
    }

    return this.__validator;
  }

  hasValidation() {
    return !!this.getMeta().fetch('validation');
  }

  validate(propertyName, rules) {
    if (!this.hasValidation()) {
      return Promise.resolve([]);
    }

    return propertyName ? this.getValidator().validateProperty(this, propertyName, rules) : this.getValidator().validateObject(this, rules);
  }

  asObject(shallow) {
    return asObject(this, shallow);
  }

  asJson(shallow) {
    return asJson(this, shallow);
  }
}) || _class5);

function asObject(entity, shallow) {
  let pojo = {};
  let metadata = entity.getMeta();

  Object.keys(entity).forEach(propertyName => {
    let value = entity[propertyName];
    let association = metadata.fetch('associations', propertyName);

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

      if (['string', 'number', 'boolean'].indexOf(typeof value) > -1 || value.constructor === Object) {
        pojo[propertyName] = value;

        return;
      }
    }

    if (!Array.isArray(value)) {
      pojo[propertyName] = !(value instanceof Entity) ? value : value.asObject(shallow);

      return;
    }

    let asObjects = [];

    value.forEach(childValue => {
      if (typeof childValue !== 'object') {
        return;
      }

      if (!(childValue instanceof Entity)) {
        asObjects.push(childValue);

        return;
      }

      if (!shallow || typeof childValue === 'object' && !childValue.getId()) {
        asObjects.push(childValue.asObject(shallow));
      }
    });

    pojo[propertyName] = asObjects;
  });

  return pojo;
}

function asJson(entity, shallow) {
  let json;

  try {
    json = JSON.stringify(asObject(entity, shallow));
  } catch (error) {
    json = '';
  }

  return json;
}

function getCollectionsCompact(forEntity, includeNew) {
  let associations = forEntity.getMeta().fetch('associations');
  let collections = {};

  Object.getOwnPropertyNames(associations).forEach(index => {
    let association = associations[index];

    if (association.type !== 'collection') {
      return;
    }

    collections[index] = [];
    if (!Array.isArray(forEntity[index])) {
      return;
    }

    forEntity[index].forEach(entity => {
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
  let flat = {
    entity: asObject(entity, true),
    collections: getCollectionsCompact(entity)
  };

  if (json) {
    flat = JSON.stringify(flat);
  }

  return flat;
}

function getPropertyForAssociation(forEntity, entity) {
  let associations = forEntity.getMeta().fetch('associations');

  return Object.keys(associations).filter(key => {
    return associations[key].entity === entity.getResource();
  })[0];
}

export function idProperty(propertyName) {
  return function (target) {
    OrmMetadata.forTarget(target).put('idProperty', propertyName);
  };
}

export function identifier(identifierName) {
  return function (target) {
    OrmMetadata.forTarget(target).put('identifier', identifierName || target.name.toLowerCase());
  };
}

export function name(entityName) {
  return function (target) {
    OrmMetadata.forTarget(target).put('name', entityName || target.name.toLowerCase());
  };
}

export function repository(repositoryReference) {
  return function (target) {
    OrmMetadata.forTarget(target).put('repository', repositoryReference);
  };
}

export function resource(resourceName) {
  return function (target) {
    OrmMetadata.forTarget(target).put('resource', resourceName || target.name.toLowerCase());
  };
}

export function validation(ValidatorClass = Validator) {
  return function (target) {
    OrmMetadata.forTarget(target).put('validation', ValidatorClass);
  };
}

export let EntityManager = (_dec4 = inject(Container), _dec4(_class6 = class EntityManager {
  constructor(container) {
    this.repositories = {};
    this.entities = {};

    this.container = container;
  }

  registerEntities(EntityClasses) {
    for (let property in EntityClasses) {
      if (EntityClasses.hasOwnProperty(property)) {
        this.registerEntity(EntityClasses[property]);
      }
    }

    return this;
  }

  registerEntity(EntityClass) {
    let meta = OrmMetadata.forTarget(EntityClass);

    this.entities[meta.fetch('identifier') || meta.fetch('resource')] = EntityClass;

    return this;
  }

  getRepository(entity) {
    let reference = this.resolveEntityReference(entity);
    let identifier = entity;
    let resource = entity;

    if (typeof reference.getResource === 'function') {
      resource = reference.getResource() || resource;
    }

    if (typeof reference.getIdentifier === 'function') {
      identifier = reference.getIdentifier() || resource;
    }

    if (typeof resource !== 'string') {
      throw new Error('Unable to find resource for entity.');
    }

    if (this.repositories[identifier]) {
      return this.repositories[identifier];
    }

    let metaData = OrmMetadata.forTarget(reference);
    let repository = metaData.fetch('repository');
    let instance = this.container.get(repository);

    if (instance.meta && instance.resource && instance.entityManager) {
      return instance;
    }

    instance.setMeta(metaData);
    instance.resource = resource;
    instance.identifier = identifier;
    instance.entityManager = this;

    if (instance instanceof DefaultRepository) {
      this.repositories[identifier] = instance;
    }

    return instance;
  }

  resolveEntityReference(resource) {
    let entityReference = resource;

    if (typeof resource === 'string') {
      entityReference = this.entities[resource] || Entity;
    }

    if (typeof entityReference === 'function') {
      return entityReference;
    }

    throw new Error('Unable to resolve to entity reference. Expected string or function.');
  }

  getEntity(entity) {
    let reference = this.resolveEntityReference(entity);
    let instance = this.container.get(reference);
    let resource = reference.getResource();
    let identifier = reference.getIdentifier() || resource;

    if (!resource) {
      if (typeof entity !== 'string') {
        throw new Error('Unable to find resource for entity.');
      }

      resource = entity;
      identifier = entity;
    }

    if (instance.hasValidation() && !instance.getValidator()) {
      let validator = this.container.get(OrmMetadata.forTarget(reference).fetch('validation'));

      instance.setValidator(validator);
    }

    return instance.setResource(resource).setIdentifier(identifier).setRepository(this.getRepository(identifier));
  }
}) || _class6);

export function validatedResource(resourceName, ValidatorClass) {
  return function (target, propertyName) {
    resource(resourceName)(target);
    validation(ValidatorClass)(target, propertyName);
  };
}

export function configure(frameworkConfig, configCallback) {
  ValidationRules.customRule('hasAssociation', value => value instanceof Entity && typeof value.id === 'number' || typeof value === 'number', `\${$displayName} must be an association.`);

  let entityManagerInstance = frameworkConfig.container.get(EntityManager);

  configCallback(entityManagerInstance);

  frameworkConfig.container.get(ViewManagerConfig).configureNamespace('spoonx/orm', {
    location: './view/{{framework}}/{{view}}.html'
  });

  frameworkConfig.globalResources('./component/association-select');
  frameworkConfig.globalResources('./component/paged');
}

export const logger = getLogger('aurelia-orm');

export function data(metaData) {
  return function (target, propertyName) {
    if (typeof metaData !== 'object') {
      logger.error('data must be an object, ' + typeof metaData + ' given.');
    }

    OrmMetadata.forTarget(target.constructor).put('data', propertyName, metaData);
  };
}

export function endpoint(entityEndpoint) {
  return function (target) {
    if (!OrmMetadata.forTarget(target).fetch('resource')) {
      logger.warn('Need to set the resource before setting the endpoint!');
    }

    OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
  };
}

export function ensurePropertyIsConfigurable(target, propertyName, descriptor) {
  if (descriptor && descriptor.configurable === false) {
    descriptor.configurable = true;

    if (!Reflect.defineProperty(target, propertyName, descriptor)) {
      logger.warn(`Cannot make configurable property '${propertyName}' of object`, target);
    }
  }
}

export function association(associationData) {
  return function (target, propertyName, descriptor) {
    ensurePropertyIsConfigurable(target, propertyName, descriptor);

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

export function enumeration(values) {
  return function (target, propertyName, descriptor) {
    ensurePropertyIsConfigurable(target, propertyName, descriptor);

    OrmMetadata.forTarget(target.constructor).put('enumerations', propertyName, values);
  };
}

export function type(typeValue) {
  return function (target, propertyName, descriptor) {
    ensurePropertyIsConfigurable(target, propertyName, descriptor);

    OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
  };
}