import {Entity} from './entity';
import {DefaultRepository} from './default-repository';
import {inject} from 'aurelia-framework';
import {Container} from 'aurelia-dependency-injection';

/**
 * @todo remove api from entity and inject repository in api (?).
 */
@inject(Container)
export class EntityManager {
  repositories = {};

  constructor (container) {
    this.container = container;
  }

  /**
   * Get a repository. Some notes:
   *  - If supplied `repository` is a string, a repository and entity will be made for you.
   *  - If supplied `repository` is an instance of Entity, a default repository will be made for you.
   *
   * @param {Entity|Repository|string} repository
   *
   * @return {Repository}
   */
  getRepository (repository) {
    if (typeof repository === 'string') {
      return this.createRepository(repository);
    }

    let repositoryInstance = this.container.get(
      typeof repository === 'function' || typeof repository === 'object'
        ? repository
        : DefaultRepository
    );

    // Did the caller supply an Entity in stead of a Repository?
    if (repositoryInstance instanceof Entity) {

      // Yeah... Okay, let's get the default repository and set the entity.
      return this.container.get(DefaultRepository).setEntity(repositoryInstance);
    }

    // We got a custom Repository.
    return repositoryInstance;
  }

  /**
   * Create a new DefaultRepository for `repository`.
   *
   * @param {string} repository
   *
   * @return {*}
   */
  createRepository (repository) {
    if (!this.repositories[repository]) {
      this.repositories[repository] = this.container.get(DefaultRepository).setEntity(this.getEntity(repository));
    }

    return this.repositories[repository];
  }

  /**
   * Get an instance for `entity`
   *
   * @param {Object|string} entity
   * @return {*}
   */
  getEntity (entity) {
    if (typeof entity === 'object') {
      return this.container.get(entity);
    }

    return this.container.get(Entity).setResource(entity);
  }
}
