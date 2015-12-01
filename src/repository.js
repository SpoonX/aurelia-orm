import {inject} from 'aurelia-framework';
import {Rest} from 'spoonx/aurelia-api';
import {metadata} from 'aurelia-metadata';
import {AssociationMetaData} from './association-metadata';

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
   * @param {Entity} entity
   * @return {Repository}
   */
  setEntity (entity) {
    this.entity = entity;

    return this;
  }

  /**
   * Set the entity reference.
   * Used to create new instances of the entity using aurelia DI.
   *
   * @param {Entity} entityReference
   * @return {Repository}
   */
  setEntityReference (entityReference) {
    this.entityReference = entityReference;

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
    let findQuery = this.api.find(this.entity.resource, criteria);

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
    return this.api.find(this.entity.resource + '/count', criteria);
  }

  /**
   * Create a new, populated entity based on supplied `data`.
   *
   * @param {{}} data
   * @return {*}
   */
  create (data) {
    return this.getPopulatedEntity(data);
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
   * @return {Entity}
   */
  getPopulatedEntity (data) {
    let entity               = this.getNewEntity();
    let associationsMetadata = metadata.getOwn(AssociationMetaData.key, entity);
    let populatedData        = {};
    let key;

    for (key in data) {
      if (!data.hasOwnProperty(key)) {
        continue;
      }

      if (!associationsMetadata || !associationsMetadata.has(key) || typeof data[key] !== 'object') {
        // Not an association, or not an object. clean copy.
        populatedData[key] = data[key];

        continue;
      }

      // Fetch the reference
      let reference = associationsMetadata.fetch(key);

      // Get the populated entities.
      populatedData[key] = this.entityManager.getRepository(reference).populateEntities(data[key]);
    }

    return entity.setData(populatedData);
  }

  /**
   * Get a new instance for entityReference.
   *
   * @return {Entity}
   */
  getNewEntity () {
    return this.entityManager.getEntity(this.entityReference);
  }
}
