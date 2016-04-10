import typer from 'typer';
import {ValidationGroup,Validation,ValidationRule} from 'aurelia-validation';
import {transient,Container,inject} from 'aurelia-dependency-injection';
import {metadata} from 'aurelia-metadata';
import {Config} from 'aurelia-api';

import './component/association-select';

function configure(aurelia, configCallback) {
  let entityManagerInstance = aurelia.container.get(EntityManager);

  configCallback(entityManagerInstance);

  ValidationGroup.prototype.hasAssociation = function() {
    return this.isNotEmpty().passesRule(new HasAssociationValidationRule());
  };

  aurelia.globalResources('./component/association-select');
}

export {
  configure,
  DefaultRepository,
  Repository,
  Entity,
  OrmMetadata,
  EntityManager,
  association,
  resource,
  endpoint,
  name,
  repository,
  validation,
  type,
  validatedResource
};

@transient()
export class DefaultRepository extends Repository {
}

@inject(Container)
export class EntityManager {
  repositories = {};
  entities     = {};

  /**
   * Construct a new EntityManager.
   *
   * @param {Container} container aurelia-dependency-injection container
   */
  constructor(container) {
    this.container = container;
  }

  /**
   * Register an array of entity references.
   *
   * @param {Entity[]|Entity} entities Array or object of entities.
   *
   * @return {EntityManager}
   */
  registerEntities(entities) {
    for (let reference in entities) {
      if (!entities.hasOwnProperty(reference)) {
        continue;
      }

      this.registerEntity(entities[reference]);
    }

    return this;
  }

  /**
   * Register an Entity reference.
   *
   * @param {Entity} entity
   *
   * @return {EntityManager}
   */
  registerEntity(entity) {
    this.entities[OrmMetadata.forTarget(entity).fetch('resource')] = entity;

    return this;
  }

  /**
   * Get a repository instance.
   *
   * @param {Entity|string} entity
   *
   * @return {Repository}
   *
   * @throws {Error}
   */
  getRepository(entity) {
    let reference = this.resolveEntityReference(entity);
    let resource  = entity;

    if (typeof reference.getResource === 'function') {
      resource = reference.getResource() || resource;
    }

    if (typeof resource !== 'string') {
      throw new Error('Unable to find resource for entity.');
    }

    // Cached instance available. Return.
    if (this.repositories[resource]) {
      return this.repositories[resource];
    }

    // Get instance of repository
    let metaData   = OrmMetadata.forTarget(reference);
    let repository = metaData.fetch('repository');
    let instance   = this.container.get(repository);

    // Already setup instance? Return.
    if (instance.meta && instance.resource && instance.entityManager) {
      return instance;
    }

    // Tell the repository instance what resource it should use.
    instance.setMeta(metaData);
    instance.resource      = resource;
    instance.entityManager = this;

    if (instance instanceof DefaultRepository) {
      // This is a default repository. We'll cache this instance.
      this.repositories[resource] = instance;
    }

    return instance;
  }

  /**
   * Resolve given resource value to an entityReference
   *
   * @param {Entity|string} resource
   *
   * @return {Entity}
   * @throws {Error}
   */
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

  /**
   * Get an instance for `entity`
   *
   * @param {string|Entity} entity
   *
   * @return {Entity}
   */
  getEntity(entity) {
    let reference = this.resolveEntityReference(entity);
    let instance  = this.container.get(reference);
    let resource  = reference.getResource();

    if (!resource) {
      if (typeof entity !== 'string') {
        throw new Error('Unable to find resource for entity.');
      }

      resource = entity;
    }

    return instance.setResource(resource).setRepository(this.getRepository(resource));
  }
}

@transient()
@inject(Validation)
export class Entity {

  /**
   * Construct a new entity.
   *
   * @param {Validation} validator
   *
   * @return {Entity}
   */
  constructor(validator) {
    this
      .define('__meta', OrmMetadata.forTarget(this.constructor))
      .define('__cleanValues', {}, true);

    // No validation? No need to set the validator.
    if (!this.hasValidation()) {
      return this;
    }

    // Set the validator.
    return this.define('__validator', validator);
  }

  /**
   * Get the transport for the resource this repository represents.
   *
   * @return {Rest}
   */
  getTransport() {
    return this.getRepository().getTransport();
  }

  /**
   * Get reference to the repository.
   *
   * @return {Repository}
   */
  getRepository() {
    return this.__repository;
  }

  /**
   * @param {Repository} repository
   *
   * @return {Entity}
   */
  setRepository(repository) {
    return this.define('__repository', repository);
  }

  /**
   * Define a non-enumerable property on the entity.
   *
   * @param {string}  property
   * @param {*}       value
   * @param {boolean} [writable]
   *
   * @return {Entity}
   */
  define(property, value, writable) {
    Object.defineProperty(this, property, {
      value: value,
      writable: !!writable,
      enumerable: false
    });

    return this;
  }

  /**
   * Get the metadata for this entity.
   *
   * return {Metadata}
   */
  getMeta() {
    return this.__meta;
  }

  /**
   * Persist the entity's state to the server.
   * Either creates a new record (POST) or updates an existing one (PUT) based on the entity's state,
   *
   * @return {Promise}
   */
  save() {
    if (!this.isNew()) {
      return this.update();
    }

    let response;
    return this.getTransport()
      .create(this.getResource(), this.asObject(true))
      .then((created) => {
        this.id  = created.id;
        response = created;
      })
      .then(() => this.saveCollections())
      .then(() => this.markClean())
      .then(() => response);
  }

  /**
   * Persist the changes made to this entity to the server.
   *
   * @see .save()
   *
   * @return {Promise}
   *
   * @throws {Error}
   */
  update() {
    if (this.isNew()) {
      throw new Error('Required value "id" missing on entity.');
    }

    // We're clean, no need to update.
    if (this.isClean()) {
      return Promise.resolve(null);
    }

    let requestBody = this.asObject(true);
    let response;

    delete requestBody.id;

    return this.getTransport()
      .update(this.getResource(), this.id, requestBody)
      .then((updated) => response = updated)
      .then(() => this.saveCollections())
      .then(() => this.markClean())
      .then(() => response);
  }

  /**
   * Add an entity to a collection (persist).
   *
   * When given entity has data, create the entity and set up the relation.
   *
   * @param {Entity|number} entity     Entity or id
   * @param {string}        [property] The name of the property
   *
   * @return {Promise}
   */
  addCollectionAssociation(entity, property) {
    property    = property || getPropertyForAssociation(this, entity);
    let body    = undefined;
    let url     = [this.getResource(), this.id, property];

    if (this.isNew()) {
      throw new Error('Cannot add association to entity that does not have an id.');
    }

    if (!(entity instanceof Entity)) {
      url.push(entity);

      return this.getTransport().create(url.join('/'));
    }

    if (entity.isNew()) {
      // Entity is new! Don't supply an ID, and just pass in the child.
      body = entity.asObject();
    } else {
      // Entity isn't new, just add id to url.
      url.push(entity.id);
    }

    return this.getTransport().create(url.join('/'), body)
      .then(created => {
        return entity.setData(created).markClean();
      });
  }

  /**
   * Remove an entity from a collection.
   *
   * @param {Entity|number} entity     Entity or id
   * @param {string}        [property] The name of the property
   *
   * @return {Promise}
   */
  removeCollectionAssociation(entity, property) {
    property       = property || getPropertyForAssociation(this, entity);
    let idToRemove = entity;

    if (entity instanceof Entity) {
      if (!entity.id) {
        return Promise.resolve(null);
      }

      idToRemove = entity.id;
    }

    return this.getTransport().destroy([this.getResource(), this.id, property, idToRemove].join('/'));
  }

  /**
   * Persist the collections on the entity.
   *
   * @return {Promise}
   */
  saveCollections() {
    let tasks              = [];
    let currentCollections = getCollectionsCompact(this);
    let cleanCollections   = this.__cleanValues.data ? this.__cleanValues.data.collections : null;

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

    // Something to add?
    addTasksForDifferences(currentCollections, cleanCollections, this.addCollectionAssociation);

    // Something to remove?
    addTasksForDifferences(cleanCollections, currentCollections, this.removeCollectionAssociation);

    return Promise.all(tasks).then(results => {
      if (!Array.isArray(results)) {
        return this;
      }

      let newState = null;

      while (newState === null) {
        newState = results.pop();
      }

      if (newState) {
        this.getRepository().getPopulatedEntity(newState, this);
      }

      return this;
    });
  }

  /**
   * Mark this entity as clean, in its current state.
   *
   * @return {Entity}
   */
  markClean() {
    let cleanValues    = getFlat(this);
    this.__cleanValues = {
      checksum: JSON.stringify(cleanValues),
      data: cleanValues
    };

    return this;
  }

  /**
   * Return if the entity is clean.
   *
   * @return {boolean}
   */
  isClean() {
    return getFlat(this, true) === this.__cleanValues.checksum;
  }

  /**
   * Return if the entity is dirty.
   *
   * @return {boolean}
   */
  isDirty() {
    return !this.isClean();
  }

  /**
   * Return if the entity is new (ergo, hasn't been persisted to the server).
   *
   * @return {boolean}
   */
  isNew() {
    return typeof this.id === 'undefined';
  }

  /**
   * Get the resource name of this entity's reference (static).
   *
   * @return {string|null}
   */
  static getResource() {
    return OrmMetadata.forTarget(this).fetch('resource');
  }

  /**
   * Get the resource name of this entity instance
   *
   * @return {string|null}
   */
  getResource() {
    return this.__resource || this.getMeta().fetch('resource');
  }

  /**
   * Set this instance's resource.
   *
   * @param {string} resource
   *
   * @return {Entity} Fluent interface
   */
  setResource(resource) {
    return this.define('__resource', resource);
  }

  /**
   * Destroy this entity (DELETE request to the server).
   *
   * @return {Promise}
   */
  destroy() {
    if (!this.id) {
      throw new Error('Required value "id" missing on entity.');
    }

    return this.getTransport().destroy(this.getResource(), this.id);
  }

  /**
   * Get the name of the entity. This is useful for labels in texts.
   *
   * @return {string}
   */
  getName() {
    let metaName = this.getMeta().fetch('name');

    if (metaName) {
      return metaName;
    }

    return this.getResource();
  }

  /**
   * Get the name of the entity (static). This is useful for labels in texts.
   *
   * @return {string}
   */
  static getName() {
    let metaName = OrmMetadata.forTarget(this).fetch('name');

    if (metaName) {
      return metaName;
    }

    return this.getResource();
  }

  /**
   * Set data on this entity.
   *
   * @param {{}} data
   * @return {Entity}
   */
  setData(data) {
    Object.assign(this, data);

    return this;
  }

  /**
   * Enable validation for this entity.
   *
   * @return {Entity}
   *
   * @throws {Error}
   */
  enableValidation() {
    if (!this.hasValidation()) {
      throw new Error('Entity not marked as validated. Did you forget the @validation() decorator?');
    }

    if (this.__validation) {
      return this;
    }

    return this.define('__validation', this.__validator.on(this));
  }

  /**
   * Get the validation instance.
   *
   * @return {Validation}
   */
  getValidation() {
    if (!this.hasValidation()) {
      return null;
    }

    if (!this.__validation) {
      this.enableValidation();
    }

    return this.__validation;
  }

  /**
   * Check if entity has validation enabled.
   *
   * @return {boolean}
   */
  hasValidation() {
    return !!this.getMeta().fetch('validation');
  }

  /**
   * Get the data in this entity as a POJO.
   *
   * @param {boolean} [shallow]
   *
   * @return {{}}
   */
  asObject(shallow) {
    return asObject(this, shallow);
  }

  /**
   * Get the data in this entity as a json string.
   *
   * @param {boolean} [shallow]
   *
   * @return {string}
   */
  asJson(shallow) {
    return asJson(this, shallow);
  }
}

/**
 * Entity representation as pojo.
 *
 * @param {Entity} entity
 * @param {boolean} [shallow]
 *
 * @return {{}}
 */
function asObject(entity, shallow) {
  let pojo     = {};
  let metadata = entity.getMeta();

  Object.keys(entity).forEach(propertyName => {
    let value = entity[propertyName];

    // No meta data, no value or no association property: simple assignment.
    if (!metadata.has('associations', propertyName) || !value) {
      pojo[propertyName] = value;

      return;
    }

    // If shallow and is object, set id.
    if (shallow && typeof value === 'object' && value.id) {
      pojo[propertyName] = value.id;

      return;
    }

    // Array, treat children as potential entities.
    if (!Array.isArray(value)) {
      // Single value not an instance of entity? Simple assignment.
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

      // If shallow, we don't handle toMany.
      if (!shallow || (typeof childValue === 'object' && !childValue.id)) {
        asObjects.push(childValue.asObject(shallow));
      }
    });

    // We don't send along empty arrays.
    if (asObjects.length > 0) {
      pojo[propertyName] = asObjects;
    }
  });

  return pojo;
}

/**
 * Entity representation as json
 *
 * @param {Entity} entity
 * @param {boolean} [shallow]
 *
 * @return {string}
 */
function asJson(entity, shallow) {
  let json;

  try {
    json = JSON.stringify(asObject(entity, shallow));
  } catch (error) {
    json = '';
  }

  return json;
}

/**
 * Get a compact object of collections (arrays of ids)
 *
 * @param {Entity} forEntity
 *
 * @return {{}}
 */
function getCollectionsCompact(forEntity) {
  let associations = forEntity.getMeta().fetch('associations');
  let collections  = {};

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

      if (entity.id) {
        collections[index].push(entity.id);
      }
    });
  });

  return collections;
}

/**
 * Get a flat, plain representation of the entity and its associations.
 *
 * @param {Entity}  entity
 * @param {boolean} [json]
 *
 * @return {{entity, collections}}
 */
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

/**
 * Get the property of the association on this entity.
 *
 * @param {Entity} forEntity
 * @param {Entity} entity
 *
 * @return {string}
 */
function getPropertyForAssociation(forEntity, entity) {
  let associations = forEntity.getMeta().fetch('associations');

  return Object.keys(associations).filter(key => {
    return associations[key].entity === entity.getResource();
  })[0];
}

export class OrmMetadata {
  static forTarget(target) {
    return metadata.getOrCreateOwn(Metadata.key, Metadata, target);
  }
}

export class Metadata {
  // The key used to identify this specific metadata
  static key = 'spoonx:orm:metadata';

  /**
   * Construct metadata with sensible defaults (so we can make assumptions in the code).
   */
  constructor() {
    this.metadata = {
      repository: DefaultRepository,
      resource: null,
      endpoint: null,
      name: null,
      associations: {}
    };
  }

  /**
   * Add a value to an array.
   *
   * @param {string} key
   * @param {*} value
   *
   * @return {Metadata}
   */
  addTo(key, value) {
    if (typeof this.metadata[key] === 'undefined') {
      this.metadata[key] = [];
    } else if (!Array.isArray(this.metadata[key])) {
      this.metadata[key] = [this.metadata[key]];
    }

    this.metadata[key].push(value);

    return this;
  }

  /**
   * Set a value for key, or one level deeper (key.key).
   *
   * @param {string} key
   * @param {string|*} valueOrNestedKey
   * @param {null|*} [valueOrNull]
   *
   * @return {Metadata}
   */
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

  /**
   * Check if key, or key.nested exists.
   *
   * @param {string} key
   * @param {string} [nested]
   *
   * @return {boolean}
   */
  has(key, nested) {
    if (typeof nested === 'undefined') {
      return typeof this.metadata[key] !== 'undefined';
    }

    return typeof this.metadata[key] !== 'undefined' && typeof this.metadata[key][nested] !== 'undefined';
  }

  /**
   * Fetch key or key.nested from metadata.
   *
   * @param {string} key
   * @param {string} [nested]
   *
   * @return {*}
   */
  fetch(key, nested) {
    if (!nested) {
      return this.has(key) ? this.metadata[key] : null;
    }

    if (!this.has(key, nested)) {
      return null;
    }

    return this.metadata[key][nested];
  }
}

@inject(Config)
export class Repository {
  transport = null;

  /**
   * Construct.
   *
   * @param {Config} clientConfig
   *
   * @constructor
   */
  constructor(clientConfig) {
    this.clientConfig = clientConfig;
  }

  /**
   * Get the transport for the resource this repository represents.
   *
   * @return {Rest}
   */
  getTransport() {
    if (this.transport === null) {
      this.transport = this.clientConfig.getEndpoint(this.getMeta().fetch('endpoint'));

      if (!this.transport) {
        throw new Error(`No transport found for '${this.getMeta().fetch('endpoint') || 'default'}'.`);
      }
    }

    return this.transport;
  }

  /**
   * Set the associated entity's meta data
   *
   * @param {Object} meta
   */
  setMeta(meta) {
    this.meta = meta;
  }

  /**
   * Get the associated entity's meta data.
   * @return {Object}
   */
  getMeta() {
    return this.meta;
  }

  /**
   * Set an entity instance.
   * Used to harvest information such as the resource name.
   *
   * @param {string} resource
   * @return {Repository}
   */
  setResource(resource) {
    this.resource = resource;

    return this;
  }

  /**
   * Get the resource name of this repository instance's reference.
   *
   * @return {string|null}
   */
  getResource() {
    return this.resource;
  }

  /**
   * Perform a find query.
   *
   * @param {null|{}|Number} criteria Criteria to add to the query.
   * @param {boolean}        [raw]    Set to true to get a POJO in stead of populated entities.
   *
   * @return {Promise}
   */
  find(criteria, raw) {
    return this.findPath(this.resource, criteria, raw);
  }

  /**
   * Perform a find query for `path`.
   *
   * @param {string}         path
   * @param {null|{}|Number} criteria Criteria to add to the query.
   * @param {boolean}        [raw]    Set to true to get a POJO in stead of populated entities.
   *
   * @return {Promise}
   */
  findPath(path, criteria, raw) {
    let findQuery = this.getTransport().find(path, criteria);

    if (raw) {
      return findQuery;
    }

    return findQuery
      .then(x => this.populateEntities(x))
      .then(populated => {
        if (!Array.isArray(populated)) {
          return populated.markClean();
        }

        populated.forEach(entity => entity.markClean());

        return populated;
      });
  }

  /**
   * Perform a count.
   *
   * @param {null|{}} criteria
   *
   * @return {Promise}
   */
  count(criteria) {
    return this.getTransport().find(this.resource + '/count', criteria);
  }

  /**
   * Populate entities based on supplied data.
   *
   * @param {{}} data
   *
   * @return {*}
   */
  populateEntities(data) {
    if (!data) {
      return null;
    }

    if (!Array.isArray(data)) {
      return this.getPopulatedEntity(data);
    }

    let collection = [];

    data.forEach(source => {
      collection.push(this.getPopulatedEntity(source));
    });

    return collection;
  }

  /**
   * @param {{}}     data
   * @param {Entity} [entity]
   *
   * @return {Entity}
   */
  getPopulatedEntity(data, entity) {
    entity             = entity || this.getNewEntity();
    let entityMetadata = entity.getMeta();
    let populatedData  = {};
    let key;

    for (key in data) {
      if (!data.hasOwnProperty(key)) {
        continue;
      }

      let value = data[key];

      if (entityMetadata.has('types', key)) {
        populatedData[key] = typer.cast(value, entityMetadata.fetch('types', key));

        continue;
      }

      if (!entityMetadata.has('associations', key) || typeof value !== 'object') {
        // Not an association, or not an object. clean copy.
        populatedData[key] = value;

        continue;
      }

      let repository     = this.entityManager.getRepository(entityMetadata.fetch('associations', key).entity);
      populatedData[key] = repository.populateEntities(value);
    }

    return entity.setData(populatedData);
  }

  /**
   * Get a new instance for entityReference.
   *
   * @return {Entity}
   */
  getNewEntity() {
    return this.entityManager.getEntity(this.resource);
  }

  /**
   * Populate a new entity, with the (empty) associations already set.
   *
   * @return {Entity}
   */
  getNewPopulatedEntity() {
    let entity       = this.getNewEntity();
    let associations = entity.getMeta().fetch('associations');

    for (let property in associations) {
      let assocMeta = associations[property];

      if (assocMeta.type !== 'entity') {
        continue;
      }

      entity[property] = this.entityManager.getRepository(assocMeta.entity).getNewEntity();
    }

    return entity;
  }
}

export function association(associationData) {
  return function(target, propertyName) {
    if (!associationData) {
      associationData = {entity: propertyName};
    } else if (typeof associationData === 'string') {
      associationData = {entity: associationData};
    }

    OrmMetadata.forTarget(target.constructor).put('associations', propertyName, {
      type: associationData.entity ? 'entity' : 'collection',
      entity: associationData.entity || associationData.collection
    });
  };
}

/**
 * @param {String} entityEndpoint
 *
 * @return {Function}
 */
export function endpoint(entityEndpoint) {
  return function(target) {
    OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
  };
}

export function name(entityName) {
  return function(target) {
    OrmMetadata.forTarget(target).put('name', entityName || target.name.toLowerCase());
  };
}

export function repository(repositoryReference) {
  return function(target) {
    OrmMetadata.forTarget(target).put('repository', repositoryReference);
  };
}

export function resource(resourceName) {
  return function(target) {
    OrmMetadata.forTarget(target).put('resource', resourceName || target.name.toLowerCase());
  };
}

export function type(typeValue) {
  return function(target, propertyName) {
    OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
  };
}

export function validatedResource(resourceName) {
  return function(target, propertyName) {
    resource(resourceName)(target);
    validation()(target, propertyName);
  };
}

export function validation() {
  return function(target) {
    OrmMetadata.forTarget(target).put('validation', true);
  };
}

export class HasAssociationValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      value => !!((value instanceof Entity && typeof value.id === 'number') || typeof value === 'number'),
      null,
      'isRequired'
    );
  }
}
