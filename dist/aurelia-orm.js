import typer from 'typer';
import {inject,transient,Container} from 'aurelia-dependency-injection';
import {Config} from 'aurelia-api';
import {metadata} from 'aurelia-metadata';
import {Validation,ValidationRule,ValidationGroup} from 'aurelia-validation';
import {getLogger} from 'aurelia-logging';

/**
 * The Repository basis class
 */
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
   * Set the resource
   *
   * @param {string} resource
   * @return {Repository} this
   * @chainable
   */
  setResource(resource) {
    this.resource = resource;

    return this;
  }

  /**
   * Get the resource
   *
   * @return {string|null}
   */
  getResource() {
    return this.resource;
  }

  /**
   * Perform a find query and populate entities with the retrieved data.
   *
   * @param {{}|Number|String} criteria Criteria to add to the query. A plain String or Number will be used as relative path.
   * @param {boolean}          [raw]    Set to true to get a POJO in stead of populated entities.
   *
   * @return {Promise<Entity|[Entity]>}
   */
  find(criteria, raw) {
    return this.findPath(this.resource, criteria, raw);
  }

  /**
   * Perform a find query for `path` and populate entities with the retrieved data.
   *
   * @param {string}           path
   * @param {{}|Number|String} criteria Criteria to add to the query. A plain String or Number will be used as relative path.
   * @param {boolean}          [raw]    Set to true to get a POJO in stead of populated entities.
   *
   * @return {Promise<Entity|[Entity]>}
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
   * Perform a count on the resource.
   *
   * @param {null|{}} criteria
   *
   * @return {Promise<Number>}
   */
  count(criteria) {
    return this.getTransport().find(this.resource + '/count', criteria);
  }

  /**
   * Get new populated entity or entities based on supplied data including associations
   *
   * @param {{}|[{}]} data|[data] The data to populate with
   *
   * @return {Entity|[Entity]}
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
   * Populate a (new) entity including associations
   *
   * @param {{}}     data The data to populate with
   * @param {Entity} [entity] optional. if not set, a new entity is returned
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
   * Populate a new entity with the empty associations set.
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

/**
 * The DefaultRepository class
 * @transient
 */
@transient()
export class DefaultRepository extends Repository {
}

export class OrmMetadata {
  static forTarget(target) {
    return metadata.getOrCreateOwn(Metadata.key, Metadata, target, target.name);
  }
}

/**
 * The MetaData class for Entity and Repository
 *
 */
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
      idProperty: 'id',
      associations: {}
    };
  }

  /**
   * Add a value to an array.
   *
   * @param {string} key
   * @param {*} value
   *
   * @return {Metadata} this
   * @chainable
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
   * @return {Metadata} this
   * @chainable
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

/**
 * The Entity basis class
 * @transient
 */
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
   * Set reference to the repository.
   *
   * @param {Repository} repository
   *
   * @return {Entity} this
   * @chainable
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
   * @chainable
   *
   * @return {Entity} this
   * @chainable
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
   * Get the id property name for this entity.
   *
   * return {String} The id property name
   */
  getIdProperty() {
    return this.getMeta().fetch('idProperty');
  }


  /**
   * Get the id property name of the entity (static).
   *
   * @return {string} The id property name
   */
  static getIdProperty() {
    let idProperty = OrmMetadata.forTarget(this).fetch('idProperty');

    return idProperty;
  }

    /**
   * Get the Id value for this entity.
   *
   * return {Number|String} The id
   */
  getId() {
    return this[this.getIdProperty()];
  }

  /**
   * Set the Id value for this entity.
   *
   * @return {Entity}  this
   * @chainable
   */
  setId(id) {
    this[this.getIdProperty()] = id;

    return this;
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
        this.setId(created[this.getIdProperty()]);
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
      // Always save collections (might have new).
      return this.saveCollections()
        .then(() => this.markClean())
        .then(() => null);
    }

    let requestBody = this.asObject(true);
    let response;

    delete requestBody[this.getIdProperty()];

    return this.getTransport()
      .update(this.getResource(), this.getId(), requestBody)
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
    property = property || getPropertyForAssociation(this, entity);
    let url  = [this.getResource(), this.getId(), property];

    if (this.isNew()) {
      throw new Error('Cannot add association to entity that does not have an id.');
    }

    if (!(entity instanceof Entity)) {
      url.push(entity);

      return this.getTransport().create(url.join('/'));
    }

    if (entity.isNew()) {
      let associationProperty = getPropertyForAssociation(entity, this);
      let relation            = entity.getMeta().fetch('association', associationProperty);

      if (!relation || relation.type !== 'entity') {
        // Many relation, create and then link.
        return entity.save().then(() => {
          if (entity.isNew()) {
            throw new Error('Entity did not return return an id on saving.');
          }

          return this.addCollectionAssociation(entity, property);
        });
      }

      // toOne relation, pass in ID to prevent extra request. Something something performance.
      entity[associationProperty] = this.getId();

      return entity.save().then(() => {
        return entity;
      });
    }

    // Entity isn't new, just add id to url.
    url.push(entity.getId());

    return this.getTransport().create(url.join('/')).then(() => {
      return entity;
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
      if (!entity.getId()) {
        return Promise.resolve(null);
      }

      idToRemove = entity.getId();
    }

    return this.getTransport().destroy([this.getResource(), this.getId(), property, idToRemove].join('/'));
  }

  /**
   * Persist the collections on the entity.
   *
   * @return {Promise}
   */
  saveCollections() {
    let tasks              = [];
    let currentCollections = getCollectionsCompact(this, true);
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

    return Promise.all(tasks).then(results => this);
  }

  /**
   * Mark this entity as clean, in its current state.
   *
   * @return {Entity} this
   * @chainable
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
    return typeof this.getId() === 'undefined';
  }

  /**
   * Resets the entity to the clean state
   *
   * @param {boolean} [shallow]
   *
   * @return {Entity}
   */
  reset(shallow) {
    let pojo     = {};
    let metadata = this.getMeta();

    Object.keys(this).forEach(propertyName => {
      let value       = this[propertyName];
      let association = metadata.fetch('associations', propertyName);

      // No meta data, no value or no association property: simple assignment.
      if (!association || !value) {
        pojo[propertyName] = value;

        return;
      }
    });

    if (this.isClean()) {
      return this;
    }

    let isNew        = this.isNew();
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
   * @return {Entity} this
   * @chainable
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
    if (!this.getId()) {
      throw new Error('Required value "id" missing on entity.');
    }

    return this.getTransport().destroy(this.getResource(), this.getId());
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
   * @param {boolean} markClean
   * @return {Entity} this
   * @chainable
   */
  setData(data, markClean) {
    Object.assign(this, data);

    if (markClean) {
      this.markClean();
    }

    return this;
  }

  /**
   * Enable validation for this entity.
   *
   * @return {Entity} this
   * @throws {Error}
   * @chainable
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
    let value       = entity[propertyName];
    let association = metadata.fetch('associations', propertyName);

    // No meta data, no value or no association property: simple assignment.
    if (!association || !value) {
      pojo[propertyName] = value;

      return;
    }

    // When shallow, we only assign toOne associations.
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
      if (!shallow || (typeof childValue === 'object' && !childValue.getId())) {
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
 * @param {Entity}  forEntity
 * @param {boolean} [includeNew]
 *
 * @return {{}}
 */
function getCollectionsCompact(forEntity, includeNew) {
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

/**
 * Associate a property with an entity (toOne) or a collection (toMany)
 *
 * @param {undefined|String|Object} associationData undefined={entity:propertyName}, String={entity:String}, Object={entity: String, collection: String}
 *
 * @return {Function}
 *
 * @decorator
 */
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

export function idProperty(propertyName) {
  return function(target) {
    OrmMetadata.forTarget(target).put('idProperty', propertyName);
  };
}

/**
 * Set the 'name' metadata on the entity
 *
 * @param {String} entityName=target.name.toLowerCase The (custom) name to use
 *
 * @return {Function}
 *
 * @decorator
 */
export function name(entityName) {
  return function(target) {
    OrmMetadata.forTarget(target).put('name', entityName || target.name.toLowerCase());
  };
}

/**
 * Set the repositoryReference metadata on the entity
 *
 * @param {String} repositoryReference The repository reference to use
 *
 * @return {Function}
 *
 * @decorator
 */
export function repository(repositoryReference) {
  return function(target) {
    OrmMetadata.forTarget(target).put('repository', repositoryReference);
  };
}

/**
 * Set the 'resourceName' metadata on the entity
 *
 * @param {String} resourceName The name of the resource
 *
 * @return {Function}
 *
 * @decorator
 */
export function resource(resourceName) {
  return function(target) {
    OrmMetadata.forTarget(target).put('resource', resourceName || target.name.toLowerCase());
  };
}

/**
 * Set the 'types' metadata on the entity
 *
 * @param {String} typeValue The type(text,string,date,datetime,integer,int,number,float,boolean,bool,smart,autodetect (based on value)) to use for this property using typer
 *
 * @return {Function}
 *
 * @decorator
 */
export function type(typeValue) {
  return function(target, propertyName) {
    OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
  };
}

/**
 * Set the 'validation' metadata to 'true'
 *
 * @return {Function}
 *
 * @decorator
 */
export function validation() {
  return function(target) {
    OrmMetadata.forTarget(target).put('validation', true);
  };
}

/**
 * The EntityManager class
 */
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
   * @return {EntityManager} this
   * @chainable
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
   * @return {EntityManager} this
   * @chainable
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

/**
 * Set the 'resource' metadata and enables validation on the entity
 *
 * @param {String} resourceName The name of the resource
 *
 * @return {Function}
 *
 * @decorator
 */
export function validatedResource(resourceName) {
  return function(target, propertyName) {
    resource(resourceName)(target);
    validation()(target, propertyName);
  };
}

// eslint-disable-line no-unused-vars
// eslint-disable-line no-unused-vars

export function configure(aurelia, configCallback) {
  let entityManagerInstance = aurelia.container.get(EntityManager);

  configCallback(entityManagerInstance);

  ValidationGroup.prototype.hasAssociation = function() {
    return this.isNotEmpty().passesRule(new HasAssociationValidationRule());
  };

  aurelia.globalResources('./component/association-select');
  aurelia.globalResources('./component/paged');
}

export const logger = getLogger('aurelia-orm');

/**
* Set genenric 'data' metadata.
*
 * @param {object} metaData The data to set
 *
 * @returns {function}
 *
 * @decorator
 */
export function data(metaData) {
  /**
   * @param {function} target
   * @param {string} propertyName
   *
   * @returns {OrmMetadata}
   */
  return function(target, propertyName) {
    if (typeof metaData !== 'object') {
      logger.error('data must be an object, ' + typeof metaData + ' given.');
    }

    OrmMetadata.forTarget(target.constructor).put('data', propertyName, metaData);
  };
}

/**
 * Set the 'endpoint' metadta of an entity. Needs a set resource
 *
 * @param {String} entityEndpoint The endpoint name to use
 *
 * @return {Function}
 *
 * @decorator
 */
export function endpoint(entityEndpoint) {
  return function(target) {
    if (!OrmMetadata.forTarget(target).fetch('resource')) {
      logger.warn('Need to set the resource before setting the endpoint!');
    }

    OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
  };
}
