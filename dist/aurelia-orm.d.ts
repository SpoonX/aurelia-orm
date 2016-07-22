import {inject,transient,Container} from 'aurelia-dependency-injection';
import {Config} from 'aurelia-api';
import {metadata} from 'aurelia-metadata';
import {Validation,ValidationRule,ValidationGroup} from 'aurelia-validation';
import {getLogger} from 'aurelia-logging';
import {bindingMode,BindingEngine} from 'aurelia-binding';
import {bindable,customElement} from 'aurelia-templating';

/**
 * The Repository basis class
 */
export declare class Repository {
  transport: any;
  
  /**
     * Construct.
     *
     * @param {Config} clientConfig
     *
     * @constructor
     */
  constructor(clientConfig?: any);
  
  /**
     * Get the transport for the resource this repository represents.
     *
     * @return {Rest}
     */
  getTransport(): any;
  
  /**
     * Set the associated entity's meta data
     *
     * @param {Object} meta
     */
  setMeta(meta?: any): any;
  
  /**
     * Get the associated entity's meta data.
     * @return {Object}
     */
  getMeta(): any;
  
  /**
     * Set the resource
     *
     * @param {string} resource
     * @return {Repository} this
     * @chainable
     */
  setResource(resource?: any): any;
  
  /**
     * Get the resource
     *
     * @return {string|null}
     */
  getResource(): any;
  
  /**
     * Perform a find query and populate entities with the retrieved data.
     *
     * @param {{}|Number|String} criteria Criteria to add to the query. A plain String or Number will be used as relative path.
     * @param {boolean}          [raw]    Set to true to get a POJO in stead of populated entities.
     *
     * @return {Promise<Entity|[Entity]>}
     */
  find(criteria?: any, raw?: any): any;
  
  /**
     * Perform a find query for `path` and populate entities with the retrieved data.
     *
     * @param {string}           path
     * @param {{}|Number|String} criteria Criteria to add to the query. A plain String or Number will be used as relative path.
     * @param {boolean}          [raw]    Set to true to get a POJO in stead of populated entities.
     *
     * @return {Promise<Entity|[Entity]>}
     */
  findPath(path?: any, criteria?: any, raw?: any): any;
  
  /**
     * Perform a count on the resource.
     *
     * @param {null|{}} criteria
     *
     * @return {Promise<Number>}
     */
  count(criteria?: any): any;
  
  /**
     * Get new populated entity or entities based on supplied data including associations
     *
     * @param {{}|[{}]} data|[data] The data to populate with
     *
     * @return {Entity|[Entity]}
     */
  populateEntities(data?: any): any;
  
  /**
     * Populate a (new) entity including associations
     *
     * @param {{}}     data The data to populate with
     * @param {Entity} [entity] optional. if not set, a new entity is returned
     *
     * @return {Entity}
     */
  getPopulatedEntity(data?: any, entity?: any): any;
  
  /**
     * Get a new instance for entityReference.
     *
     * @return {Entity}
     */
  getNewEntity(): any;
  
  /**
     * Populate a new entity with the empty associations set.
     *
     * @return {Entity}
     */
  getNewPopulatedEntity(): any;
}

/**
 * The DefaultRepository class
 * @transient
 */
export declare class DefaultRepository extends Repository {

}
export declare class OrmMetadata {
  static forTarget(target?: any): any;
}

/**
 * The MetaData class for Entity and Repository
 *
 */
export declare class Metadata {
  
  // The key used to identify this specific metadata
  static key: any;
  
  /**
     * Construct metadata with sensible defaults (so we can make assumptions in the code).
     */
  constructor();
  
  /**
     * Add a value to an array.
     *
     * @param {string} key
     * @param {*} value
     *
     * @return {Metadata} this
     * @chainable
  */
  addTo(key?: any, value?: any): any;
  
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
  put(key?: any, valueOrNestedKey?: any, valueOrNull?: any): any;
  
  /**
     * Check if key, or key.nested exists.
     *
     * @param {string} key
     * @param {string} [nested]
     *
     * @return {boolean}
     */
  has(key?: any, nested?: any): any;
  
  /**
     * Fetch key or key.nested from metadata.
     *
     * @param {string} key
     * @param {string} [nested]
     *
     * @return {*}
     */
  fetch(key?: any, nested?: any): any;
}

/**
 * The Entity basis class
 * @transient
 */
export declare class Entity {
  
  /**
     * Construct a new entity.
     *
     * @param {Validation} validator
     *
     * @return {Entity}
     */
  constructor(validator?: any);
  
  /**
     * Get the transport for the resource this repository represents.
     *
     * @return {Rest}
     */
  getTransport(): any;
  
  /**
     * Get reference to the repository.
     *
     * @return {Repository}
     */
  getRepository(): any;
  
  /**
     * Set reference to the repository.
     *
     * @param {Repository} repository
     *
     * @return {Entity} this
     * @chainable
     */
  setRepository(repository?: any): any;
  
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
  define(property?: any, value?: any, writable?: any): any;
  
  /**
     * Get the metadata for this entity.
     *
     * return {Metadata}
     */
  getMeta(): any;
  
  /**
     * Get the id property name for this entity.
     *
     * return {String} The id property name
     */
  getIdProperty(): any;
  
  /**
     * Get the id property name of the entity (static).
     *
     * @return {string} The id property name
     */
  static getIdProperty(): any;
  
  /**
     * Get the Id value for this entity.
     *
     * return {Number|String} The id
     */
  getId(): any;
  
  /**
     * Set the Id value for this entity.
     *
     * @return {Entity}  this
     * @chainable
     */
  setId(id?: any): any;
  
  /**
     * Persist the entity's state to the server.
     * Either creates a new record (POST) or updates an existing one (PUT) based on the entity's state,
     *
     * @return {Promise}
     */
  save(): any;
  
  /**
     * Persist the changes made to this entity to the server.
     *
     * @see .save()
     *
     * @return {Promise}
     *
     * @throws {Error}
     */
  update(): any;
  
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
  addCollectionAssociation(entity?: any, property?: any): any;
  
  /**
     * Remove an entity from a collection.
     *
     * @param {Entity|number} entity     Entity or id
     * @param {string}        [property] The name of the property
     *
     * @return {Promise}
     */
  removeCollectionAssociation(entity?: any, property?: any): any;
  
  /**
     * Persist the collections on the entity.
     *
     * @return {Promise}
     */
  saveCollections(): any;
  
  /**
     * Mark this entity as clean, in its current state.
     *
     * @return {Entity} this
     * @chainable
     */
  markClean(): any;
  
  /**
     * Return if the entity is clean.
     *
     * @return {boolean}
     */
  isClean(): any;
  
  /**
     * Return if the entity is dirty.
     *
     * @return {boolean}
     */
  isDirty(): any;
  
  /**
     * Return if the entity is new (ergo, hasn't been persisted to the server).
     *
     * @return {boolean}
     */
  isNew(): any;
  
  /**
     * Resets the entity to the clean state
     *
     * @param {boolean} [shallow]
     *
     * @return {Entity}
     */
  reset(shallow?: any): any;
  
  /**
     * Get the resource name of this entity's reference (static).
     *
     * @return {string|null}
     */
  static getResource(): any;
  
  /**
     * Get the resource name of this entity instance
     *
     * @return {string|null}
     */
  getResource(): any;
  
  /**
     * Set this instance's resource.
     *
     * @param {string} resource
     *
     * @return {Entity} this
     * @chainable
     */
  setResource(resource?: any): any;
  
  /**
     * Destroy this entity (DELETE request to the server).
     *
     * @return {Promise}
     */
  destroy(): any;
  
  /**
     * Get the name of the entity. This is useful for labels in texts.
     *
     * @return {string}
     */
  getName(): any;
  
  /**
     * Get the name of the entity (static). This is useful for labels in texts.
     *
     * @return {string}
     */
  static getName(): any;
  
  /**
     * Set data on this entity.
     *
     * @param {{}} data
     * @param {boolean} markClean
     * @return {Entity} this
     * @chainable
     */
  setData(data?: any, markClean?: any): any;
  
  /**
     * Enable validation for this entity.
     *
     * @return {Entity} this
     * @throws {Error}
     * @chainable
     */
  enableValidation(): any;
  
  /**
     * Get the validation instance.
     *
     * @return {Validation}
     */
  getValidation(): any;
  
  /**
     * Check if entity has validation enabled.
     *
     * @return {boolean}
     */
  hasValidation(): any;
  
  /**
     * Get the data in this entity as a POJO.
     *
     * @param {boolean} [shallow]
     *
     * @return {{}}
     */
  asObject(shallow?: any): any;
  
  /**
     * Get the data in this entity as a json string.
     *
     * @param {boolean} [shallow]
     *
     * @return {string}
     */
  asJson(shallow?: any): any;
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
export declare function association(associationData?: any): any;
export declare function idProperty(propertyName?: any): any;

/**
 * Set the 'name' metadata on the entity
 *
 * @param {String} entityName=target.name.toLowerCase The (custom) name to use
 *
 * @return {Function}
 *
 * @decorator
 */
export declare function name(entityName?: any): any;

/**
 * Set the repositoryReference metadata on the entity
 *
 * @param {String} repositoryReference The repository reference to use
 *
 * @return {Function}
 *
 * @decorator
 */
export declare function repository(repositoryReference?: any): any;

/**
 * Set the 'resourceName' metadata on the entity
 *
 * @param {String} resourceName The name of the resource
 *
 * @return {Function}
 *
 * @decorator
 */
export declare function resource(resourceName?: any): any;

/**
 * Set the 'types' metadata on the entity
 *
 * @param {String} typeValue The type(text,string,date,datetime,integer,int,number,float,boolean,bool,smart,autodetect (based on value)) to use for this property using typer
 *
 * @return {Function}
 *
 * @decorator
 */
export declare function type(typeValue?: any): any;

/**
 * Set the 'validation' metadata to 'true'
 *
 * @return {Function}
 *
 * @decorator
 */
export declare function validation(): any;

/**
 * The EntityManager class
 */
export declare class EntityManager {
  repositories: any;
  entities: any;
  
  /**
     * Construct a new EntityManager.
     *
     * @param {Container} container aurelia-dependency-injection container
     */
  constructor(container?: any);
  
  /**
     * Register an array of entity references.
     *
     * @param {Entity[]|Entity} entities Array or object of entities.
     *
     * @return {EntityManager} this
     * @chainable
     */
  registerEntities(entities?: any): any;
  
  /**
     * Register an Entity reference.
     *
     * @param {Entity} entity
     *
     * @return {EntityManager} this
     * @chainable
     */
  registerEntity(entity?: any): any;
  
  /**
     * Get a repository instance.
     *
     * @param {Entity|string} entity
     *
     * @return {Repository}
     * @throws {Error}
     */
  getRepository(entity?: any): any;
  
  /**
     * Resolve given resource value to an entityReference
     *
     * @param {Entity|string} resource
     *
     * @return {Entity}
     * @throws {Error}
     */
  resolveEntityReference(resource?: any): any;
  
  /**
     * Get an instance for `entity`
     *
     * @param {string|Entity} entity
     *
     * @return {Entity}
     */
  getEntity(entity?: any): any;
}
export declare class HasAssociationValidationRule extends ValidationRule {
  constructor();
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
export declare function validatedResource(resourceName?: any): any;

// eslint-disable-line no-unused-vars
// eslint-disable-line no-unused-vars
export declare function configure(aurelia?: any, configCallback?: any): any;
export declare const logger: any;

/**
* Set genenric 'data' metadata.
*
 * @param {object} metaData The data to set
 *
 * @returns {function}
 *
 * @decorator
 */
export declare function data(metaData?: any): any;

/**
 * Set the 'endpoint' metadta of an entity. Needs a set resource
 *
 * @param {String} entityEndpoint The endpoint name to use
 *
 * @return {Function}
 *
 * @decorator
 */
export declare function endpoint(entityEndpoint?: any): any;
export declare class AssociationSelect {
  criteria: any;
  repository: any;
  identifier: any;
  property: any;
  resource: any;
  options: any;
  association: any;
  manyAssociation: any;
  value: any;
  multiple: any;
  ownMeta: any;
  
  /**
     * Create a new select element.
     *
     * @param {BindingEngine} bindingEngine
     * @param {EntityManager} entityManager
     * @param {Element}       element
     */
  constructor(bindingEngine?: any, entityManager?: any, element?: any);
  
  /**
     * (Re)Load the data for the select.
     *
     * @param {string|Array} [reservedValue]
     *
     * @return {Promise}
     */
  load(reservedValue?: any): any;
  
  /**
     * Set the value for the select.
     *
     * @param {string|Array} value
     */
  setValue(value?: any): any;
  
  /**
     * Get criteria, or default to empty object.
     *
     * @return {{}}
     */
  getCriteria(): any;
  
  /**
     * Build the find that's going to fetch the option values for the select.
     * This method works well with associations, and reloads when they change.
     *
     * @return {Promise}
     */
  buildFind(): any;
  
  /**
     * Check if all associations have values set.
     *
     * @return {boolean}
     */
  verifyAssociationValues(): any;
  
  /**
     * Add a watcher to the list. Whenever given association changes, the select will reload its contents.
     *
     * @param {Entity|Array} association Entity or array of Entity instances.
     *
     * @return {AssociationSelect}
     */
  observe(association?: any): any;
  resourceChanged(resource?: any): any;
  
  /**
     * When attached to the DOM, initialize the component.
     */
  attached(): any;
  
  /**
     * Find the name of the property in meta, reversed by resource.
     *
     * @param {Metadata} meta
     * @param {string}   resource
     *
     * @return {string}
     */
  propertyForResource(meta?: any, resource?: any): any;
  
  /**
     * Dispose all subscriptions on unbind.
     */
  unbind(): any;
}
export declare class Paged {
  data: any;
  page: any;
  criteria: any;
  resource: any;
  limit: any;
  
  /**
     * Attach to view
     */
  attached(): any;
  
  /**
     * Reload data
     */
  reloadData(): any;
  
  /**
     * Check if the value is changed
     *
     * @param  {string|{}}   newVal New value
     * @param  {[string|{}]} oldVal Old value
     * @return {Boolean}     Whenever the value is changed
     */
  isChanged(newVal?: any, oldVal?: any): any;
  
  /**
     * Change page
     *
     * @param  {integer} newVal New page value
     * @param  {integer} oldVal Old page value
     */
  pageChanged(newVal?: any, oldVal?: any): any;
  
  /**
     * Change criteria
     *
     * @param  {{}} newVal New criteria value
     * @param  {{}} oldVal Old criteria value
     */
  criteriaChanged(newVal?: any, oldVal?: any): any;
  
  /**
     * Get data from repository
     */
  getData(): any;
}