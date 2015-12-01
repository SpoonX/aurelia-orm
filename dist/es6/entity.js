import {Validation} from 'aurelia-validation';
import {transient, inject} from 'aurelia-framework';
import {Rest} from 'spoonx/aurelia-api';
import {metadata} from 'aurelia-metadata';
import {AssociationMetaData} from './association-metadata';

@transient()
@inject(Validation, Rest)
export class Entity {
  constructor (validator, restClient) {
    Object.defineProperty(this, 'validator', {
      value     : validator,
      writable  : false,
      enumerable: false
    });

    Object.defineProperty(this, 'api', {
      value     : restClient,
      writable  : false,
      enumerable: false
    });
  }

  setEntityManager (entityManager) {
    Object.defineProperty(this, 'entityManager', {
      value     : entityManager,
      writable  : false,
      enumerable: false
    });

    return this;
  }

  /**
   * Persist the entity's state to the server.
   * Either creates a new record (POST) or updates an existing one (PUT) based on the entity's state,
   *
   * @return {Promise}
   */
  save () {
    if (this.id) {
      return this.update();
    }

    return this.api.create(this.resource, this.asObject(true));
  }

  /**
   * Destroy this entity (DELETE request to the server).
   *
   * @return {Promise}
   */
  destroy () {
    if (!this.id) {
      throw new Error('Required value "id" missing on entity.');
    }

    return this.api.destroy(this.resource, this.id)
  }

  /**
   * Set data on this entity.
   *
   * @param {{}} data
   * @return {Entity}
   */
  setData (data) {
    Object.assign(this, data);

    return this;
  }

  /**
   * Set the resource (endpoint) this entity should represent.
   *
   * @param {string} resource
   * @return {Entity}
   */
  setResource (resource) {
    Object.defineProperty(this, 'resource', {
      value     : resource,
      writable  : false,
      enumerable: false
    });

    return this;
  }

  /**
   * Persist the changes made to this entity to the server.
   *
   * @see .save()
   * @return {Promise}
   * @throws Error
   */
  update () {
    if (!this.id) {
      throw new Error('Required value "id" missing on entity.');
    }

    return this.api.update(this.resource, this.id, this.asObject(true));
  }

  /**
   * Enable validation for this entity.
   *
   * @return {Entity}
   */
  enableValidation () {
    Object.defineProperty(this, 'validation', {
      value     : this.validator.on(this),
      writable  : false,
      enumerable: false
    });

    return this;
  }

  /**
   * Get the data in this entity as a POJO.
   *
   * @return {{}}
   *
   * @todo check for associations meta data.
   *  Should use id's if `associations` !== true
   *
   *  Now let's check if the object has an ID. If so, set that as the value.
   */
  asObject (shallow) {
    let pojo                 = {};
    let associationsMetadata = metadata.getOwn(AssociationMetaData.key, this);

    Object.keys(this).forEach(propertyName => {
      let value = this[propertyName];

      // No meta data or no association property: simple assignment.
      if (!associationsMetadata || !associationsMetadata.has(propertyName)) {
        return pojo[propertyName] = value;
      }

      // If shallow and is object, set id.
      if (shallow && typeof value === 'object' && value.id) {
        return pojo[propertyName] = value.id;
      }

      // Array, treat children as potential entities.
      if (Array.isArray(value)) {
        let asObjects = [];

        value.forEach((childValue, index) => {
          if (!(childValue instanceof Entity)) {
            return asObjects[index] = childValue;
          }

          asObjects[index] = childValue.asObject();
        });

        return pojo[propertyName] = asObjects;
      }

      // Single value not an instance of entity? Simple assignment.
      if (!(value instanceof Entity)) {
        return pojo[propertyName] = value;
      }

      pojo[propertyName] = value.asObject();
    });

    return pojo;
  }

  /**
   * Get the data in this entity as a json string.
   *
   * @return {string}
   */
  asJson (shallow) {
    let json;

    try {
      json = JSON.stringify(this.asObject(shallow));
    } catch (error) {
      json = '';
    }

    return json;
  }
}
