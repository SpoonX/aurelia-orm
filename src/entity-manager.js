import {Entity} from './entity';
import {DefaultRepository} from './default-repository';
import {Container, inject} from 'aurelia-dependency-injection';
import {OrmMetadata} from './orm-metadata';
import {Validator} from 'aurelia-validation';

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
   * Register an array of entity classes.
   *
   * @param {function[]|function} Entity classes array or object of Entity constructors.
   *
   * @return {EntityManager} this
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
   * @return {EntityManager} this
   * @chainable
   */
  registerEntity(EntityClass) {
    if (!Entity.isPrototypeOf(EntityClass)) {
      throw new Error(`
        Trying to register non-Entity with aurelia-orm.
        Are you using 'import *' to load your entities?
        <http://aurelia-orm.spoonx.org/configuration.html>
      `);
    }

    this.entities[OrmMetadata.forTarget(EntityClass).fetch('resource')] = EntityClass;

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

     // Set the validator.
    if (instance.hasValidation() && !(instance.getValidator())) {
      let validator = this.container.get(Validator);

      instance.setValidator(validator);
    }

    return instance.setResource(resource).setRepository(this.getRepository(resource));
  }
}
