import {inject} from 'aurelia-framework';
import {Rest} from 'spoonx/aurelia-api';
import {Entity} from './entity';
import {OrmMetadata} from './orm-metadata';

@inject(Rest)
export class Repository {
  /**
   * Construct.
   *
   * @param {Rest} restClient
   *
   * @constructor
   */
  constructor (restClient) {
    this.api = restClient;
  }

  /**
   * Set an entity instance.
   * Used to harvest information such as the resource name.
   *
   * @param {string} resource
   * @return {Repository}
   */
  setResource (resource) {
    this.resource = resource;

    return this;
  }

  /**
   * Perform a find query.
   *
   * @param {null|{}|Number} criteria Criteria to add to the query.
   * @param {boolean}        raw      Set to true to get a POJO in stead of populated entities.
   * @return {*}
   */
  find (criteria, raw) {
    let findQuery = this.api.find(this.resource, criteria);

    if (raw) {
      return findQuery;
    }

    return findQuery.then(x => this.populateEntities(x));
  }

  /**
   * Perform a count.
   *
   * @param {null|{}} criteria
   * @return {*}
   */
  count (criteria) {
    return this.api.find(this.resource + '/count', criteria);
  }

  /**
   * Populate entities based on supplied data.
   *
   * @param {{}} data
   * @return {*}
   */
  populateEntities (data) {
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
   * @param {{}} data
   *
   * @return {Entity}
   */
  getPopulatedEntity (data) {
    let entity         = this.getNewEntity();
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

      let repository     = this.entityManager.getRepository(entityMetadata.fetch('associations', key));
      populatedData[key] = repository.populateEntities(value);
    }

    return entity.setData(populatedData);
  }

  /**
   * Get a new instance for entityReference.
   *
   * @return {Entity}
   */
  getNewEntity () {
    return this.entityManager.getEntity(this.resource);
  }
}
