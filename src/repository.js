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
   * @param {{}} meta
   */
  setMeta(meta) {
    this.meta = meta;
  }

  /**
   * Get the associated entity's meta data.
   * @return {{}}
   */
  getMeta() {
    return this.meta;
  }

  /**
   * Set the identifier
   *
   * @param {string} identifier
   * @return {Repository} this
   * @chainable
   */
  setIdentifier(identifier) {
    this.identifier = identifier;

    return this;
  }

  /**
   * Get the identifier
   *
   * @return {string|null}
   */
  getIdentifier() {
    return this.identifier;
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
   * @param {{}|number|string} criteria Criteria to add to the query. A plain string or number will be used as relative path.
   * @param {boolean}          [raw]    Set to true to get a POJO in stead of populated entities.
   *
   * @return {Promise<Entity|[Entity]>}
   */
  find(criteria, raw) {
    return this.findPath(this.resource, criteria, raw);
  }

  /**
   * Perform a find query and populate entities with the retrieved data, limited to one result.
   *
   * @param {{}|number|string} criteria Criteria to add to the query. A plain string or number will be used as relative path.
   * @param {boolean}          [raw]    Set to true to get a POJO in stead of populated entities.
   *
   * @return {Promise<Entity|[Entity]>}
   */
  findOne(criteria, raw) {
    return this.findPath(this.resource, criteria, raw, true);
  }

  /**
   * Perform a find query for `path` and populate entities with the retrieved data.
   *
   * @param {string}           path
   * @param {{}|number|string} criteria Criteria to add to the query. A plain string or number will be used as relative path.
   * @param {boolean}          [raw]    Set to true to get a POJO in stead of populated entities.
   * @param {boolean}          [single] Whether or not this is a findOne.
   *
   * @return {Promise<Entity|[Entity]>}
   */
  findPath(path, criteria, raw, single) {
    let transport = this.getTransport();
    let findQuery;

    if (single) {
      if (typeof criteria === 'object' && criteria !== null) {
        criteria.limit = 1;
      }

      findQuery = transport.findOne(path, criteria);
    } else {
      findQuery = transport.find(path, criteria);
    }

    if (raw) {
      return findQuery;
    }

    return findQuery
      .then(response => {
        return this.populateEntities(response);
      })
      .then(populated => {
        if (!populated) {
          return null;
        }

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
   * @return {Promise<number>}
   */
  count(criteria) {
    return this.getTransport().find(this.resource + '/count', criteria);
  }

  /**
   * Get new populated entity or entities based on supplied data including associations
   *
   * @param {{}|[{}]} data|[data] The data to populate with
   * @param {boolean} [clean]     Mark the entities as clean or not
   *
   * @return {Entity|[Entity]}
   */
  populateEntities(data, clean) {
    if (!data) {
      return null;
    }

    if (!Array.isArray(data)) {
      return this.getPopulatedEntity(data, null, clean);
    }

    let collection = [];

    data.forEach(source => {
      collection.push(this.getPopulatedEntity(source, null, clean));
    });

    return collection;
  }

  /**
   * Populate a (new) entity including associations
   *
   * @param {{}}      data     The data to populate with
   * @param {Entity}  [entity] optional. if not set, a new entity is returned
   * @param {boolean} [clean]  Mark the entities as clean or not
   *
   * @return {Entity}
   */
  getPopulatedEntity(data, entity, clean) {
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
        const dataType = entityMetadata.fetch('types', key);

        if ((dataType === 'date' || dataType === 'datetime') && !value) {
          continue;
        }

        populatedData[key] = typer.cast(value, dataType);

        continue;
      }

      if (!entityMetadata.has('associations', key) || typeof value !== 'object') {
        // Not an association, or not an object. clean copy.
        populatedData[key] = value;

        continue;
      }

      let repository = this.entityManager.getRepository(entityMetadata.fetch('associations', key).entity);

      populatedData[key] = repository.populateEntities(value, clean);
    }

    return entity.setData(populatedData, clean);
  }

  /**
   * Get a new instance for entityReference.
   *
   * @return {Entity}
   */
  getNewEntity() {
    return this.entityManager.getEntity(this.identifier || this.resource);
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
      if (associations.hasOwnProperty(property)) {
        let assocMeta = associations[property];

        if (assocMeta.type !== 'entity') {
          continue;
        }

        entity[property] = this.entityManager.getRepository(assocMeta.entity).getNewEntity();
      }
    }

    return entity;
  }
}
