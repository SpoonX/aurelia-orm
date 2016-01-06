import {inject} from 'aurelia-framework';
import {Rest} from 'spoonx/aurelia-api';

@inject(Rest)
export class Repository {
  /**
   * Construct.
   *
   * @param {Rest} restClient
   *
   * @constructor
   */
  constructor(restClient) {
    this.api = restClient;
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
   * @return {Promise}
   */
  findPath(path, criteria, raw) {
    let findQuery = this.api.find(path, criteria);

    if (raw) {
      return findQuery;
    }

    return findQuery
      .then(x => this.populateEntities(x))
      .then(populated => {
        if (!Array.isArray(populated)) {
          return populated;
        }

        populated.forEach(entity => entity.markClean());

        return populated;
      });
  }

  /**
   * Perform a count.
   *
   * @param {null|{}} criteria
   * @return {Promise}
   */
  count(criteria) {
    return this.api.find(this.resource + '/count', criteria);
  }

  /**
   * Populate entities based on supplied data.
   *
   * @param {{}} data
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
   * @param {Entity} entity
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
