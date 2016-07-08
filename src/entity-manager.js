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
