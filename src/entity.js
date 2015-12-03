import {Validation} from 'aurelia-validation';
import {transient, inject} from 'aurelia-framework';
import {Rest} from 'spoonx/aurelia-api';
import {OrmMetadata} from './orm-metadata';

@transient()
@inject(Validation, Rest)
export class Entity {
  constructor (validator, restClient) {
    Object.defineProperty(this, '__validator', {
      value     : validator,
      writable  : false,
      enumerable: false
    });

    Object.defineProperty(this, '__api', {
      value     : restClient,
      writable  : false,
      enumerable: false
    });

    Object.defineProperty(this, '__meta', {
      value     : OrmMetadata.forTarget(this.constructor),
      writable  : false,
      enumerable: false
    });

    if (this.__meta.fetch('validation')) {
      this.enableValidation();
    }
  }

  /**
   * Get the metadata for this entity.
   *
   * return {Metadata}
   */
  getMeta () {
    return this.__meta;
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

    return this.__api.create(this.getResource(), this.asObject(true));
  }

  /**
   * Persist the changes made to this entity to the server.
   *
   * @see .save()
   * @return {Promise}
   * @throws {Error}
   */
  update () {
    if (!this.id) {
      throw new Error('Required value "id" missing on entity.');
    }

    let requestBody = this.asObject(true);

    delete requestBody.id;

    return this.__api.update(this.getResource(), this.id, requestBody);
  }

  /**
   * Get the resource name of this entity's reference (static).
   *
   * @return {string|null}
   */
  static getResource () {
    return OrmMetadata.forTarget(this).fetch('resource');
  }

  /**
   * Get the resource name of this entity instance
   *
   * @return {string|null}
   */
  getResource () {
    return this.__resource || this.getMeta().fetch('resource');
  }

  /**
   * Set this instance's resource.
   *
   * @param {string} resource
   *
   * @return {Entity} Fluent interface
   */
  setResource (resource) {
    Object.defineProperty(this, '__resource', {
      value     : resource,
      writable  : false,
      enumerable: false
    });

    return this;
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

    return this.__api.destroy(this.getResource(), this.id);
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
   * Enable validation for this entity.
   *
   * @return {Entity}
   */
  enableValidation () {
    Object.defineProperty(this, '__validation', {
      value     : this.__validator.on(this),
      writable  : false,
      enumerable: false
    });

    return this;
  }

  /**
   * Get the validation instance.
   *
   * @return {Validation}
   */
  getValidation () {
    return this.__validation;
  }

  /**
   * Check if entity has validation enabled.
   *
   * @return {boolean}
   */
  hasValidation () {
    return !!this.__validation;
  }

  /**
   * Get the data in this entity as a POJO.
   *
   * @return {{}}
   *
   *  Now let's check if the object has an ID. If so, set that as the value.
   */
  asObject (shallow) {
    let pojo     = {};
    let metadata = this.getMeta();

    Object.keys(this).forEach(propertyName => {
      let value = this[propertyName];

      // No meta data or no association property: simple assignment.
      if (!metadata.has('associations', propertyName)) {
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
