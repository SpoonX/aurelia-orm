import {inject} from 'aurelia-dependency-injection';
import {Config} from 'aurelia-api';
import typer from 'typer';

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
