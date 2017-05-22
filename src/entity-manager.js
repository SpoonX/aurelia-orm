import {Entity} from './entity';
import {DefaultRepository} from './default-repository';
import {Container, inject} from 'aurelia-dependency-injection';
import {OrmMetadata} from './orm-metadata';

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
   * @param {Container} container
   */
  constructor(container) {
    this.container = container;
  }

  /**
   * Register an array of entity classes.
   *
   * @param {function[]|function} EntityClasses Array or object of Entity constructors.
   *
   * @return {EntityManager} itself
   * @chainable
   */
  registerEntities(EntityClasses) {
    for (let property in EntityClasses) {
      if (EntityClasses.hasOwnProperty(property)) {
        this.registerEntity(EntityClasses[property]);
      }
    }

    return this;
  }

  /**
   * Register an Entity class.
   *
   * @param {function} EntityClass
   *
   * @return {EntityManager} itself
   * @chainable
   */
  registerEntity(EntityClass) {
    let meta = OrmMetadata.forTarget(EntityClass);

    this.entities[meta.fetch('identifier') || meta.fetch('resource')] = EntityClass;

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
    let reference  = this.resolveEntityReference(entity);
    let identifier = entity;
    let resource   = entity;

    if (typeof reference.getResource === 'function') {
      resource = reference.getResource() || resource;
    }

    if (typeof reference.getIdentifier === 'function') {
      identifier = reference.getIdentifier() || resource;
    }

    if (typeof resource !== 'string') {
      throw new Error('Unable to find resource for entity.');
    }

    // Cached instance available. Return.
    if (this.repositories[identifier]) {
      return this.repositories[identifier];
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
    instance.identifier    = identifier;
    instance.entityManager = this;

    if (instance instanceof DefaultRepository) {
      // This is a default repository. We'll cache this instance.
      this.repositories[identifier] = instance;
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
    let identifier = reference.getIdentifier() || resource;

    if (!resource) {
      if (typeof entity !== 'string') {
        throw new Error('Unable to find resource for entity.');
      }

      resource = entity;
      identifier = entity;
    }

    // Set the validator.
    if (instance.hasValidation() && !(instance.getValidator())) {
      let validator = this.container.get(OrmMetadata.forTarget(reference).fetch('validation'));

      instance.setValidator(validator);
    }

    return instance.setResource(resource)
      .setIdentifier(identifier)
      .setRepository(this.getRepository(identifier));
  }
}
