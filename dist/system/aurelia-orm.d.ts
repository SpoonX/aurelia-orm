declare module 'aurelia-orm' {
  import {
    ValidationRule
  } from 'aurelia-validation';
  export class DefaultRepository extends Repository {
  
  }
  export class EntityManager {
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
       * @return {EntityManager}
       */
    registerEntities(entities?: any): any;
    
    /**
       * Register an Entity reference.
       *
       * @param {Entity} entity
       *
       * @return {EntityManager}
       */
    registerEntity(entity?: any): any;
    
    /**
       * Get a repository instance.
       *
       * @param {Entity|string} entity
       *
       * @return {Repository}
       *
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
  export class Entity {
    
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
       * @param {Repository} repository
       *
       * @return {Entity}
       */
    setRepository(repository?: any): any;
    
    /**
       * Define a non-enumerable property on the entity.
       *
       * @param {string}  property
       * @param {*}       value
       * @param {boolean} [writable]
       *
       * @return {Entity}
       */
    define(property?: any, value?: any, writable?: any): any;
    
    /**
       * Get the metadata for this entity.
       *
       * return {Metadata}
       */
    getMeta(): any;
    
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
       * @return {Entity}
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
       * @return {Entity} Fluent interface
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
       * @return {Entity}
       */
    setData(data?: any): any;
    
    /**
       * Enable validation for this entity.
       *
       * @return {Entity}
       *
       * @throws {Error}
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
  export class OrmMetadata {
    static forTarget(target?: any): any;
  }
  export class Metadata {
    
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
       * @return {Metadata}
       */
    addTo(key?: any, value?: any): any;
    
    /**
       * Set a value for key, or one level deeper (key.key).
       *
       * @param {string} key
       * @param {string|*} valueOrNestedKey
       * @param {null|*} [valueOrNull]
       *
       * @return {Metadata}
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
  export class Repository {
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
       * Set an entity instance.
       * Used to harvest information such as the resource name.
       *
       * @param {string} resource
       * @return {Repository}
       */
    setResource(resource?: any): any;
    
    /**
       * Get the resource name of this repository instance's reference.
       *
       * @return {string|null}
       */
    getResource(): any;
    
    /**
       * Perform a find query.
       *
       * @param {null|{}|Number} criteria Criteria to add to the query.
       * @param {boolean}        [raw]    Set to true to get a POJO in stead of populated entities.
       *
       * @return {Promise}
       */
    find(criteria?: any, raw?: any): any;
    
    /**
       * Perform a find query for `path`.
       *
       * @param {string}         path
       * @param {null|{}|Number} criteria Criteria to add to the query.
       * @param {boolean}        [raw]    Set to true to get a POJO in stead of populated entities.
       *
       * @return {Promise}
       */
    findPath(path?: any, criteria?: any, raw?: any): any;
    
    /**
       * Perform a count.
       *
       * @param {null|{}} criteria
       *
       * @return {Promise}
       */
    count(criteria?: any): any;
    
    /**
       * Populate entities based on supplied data.
       *
       * @param {{}} data
       *
       * @return {*}
       */
    populateEntities(data?: any): any;
    
    /**
       * @param {{}}     data
       * @param {Entity} [entity]
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
       * Populate a new entity, with the (empty) associations already set.
       *
       * @return {Entity}
       */
    getNewPopulatedEntity(): any;
  }
  export class AssociationSelect {
    criteria: any;
    repository: any;
    property: any;
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
  export function association(associationData?: any): any;
  
  /**
   * @param {String} entityEndpoint
   *
   * @return {Function}
   */
  export function endpoint(entityEndpoint?: any): any;
  export function name(entityName?: any): any;
  export function repository(repositoryReference?: any): any;
  export function resource(resourceName?: any): any;
  export function type(typeValue?: any): any;
  export function validatedResource(resourceName?: any): any;
  export function validation(): any;
  export class HasAssociationValidationRule extends ValidationRule {
    constructor();
  }
}