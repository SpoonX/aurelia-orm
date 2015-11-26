import {Validation} from 'aurelia-validation';
import {transient, inject} from 'aurelia-framework';
import {Rest} from 'spoonx/aurelia-api';

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

    return this.api.create(this.resource, this.asObject());
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

    return this.api.update(this.resource, this.id, this.asObject());
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
   */
  asObject () {
    let pojo = {};

    Object.keys(this).forEach(propertyName => {
      pojo[propertyName] = this[propertyName];
    });

    return pojo;
  }

  /**
   * Get the data in this entity as a json string.
   *
   * @return {string}
   */
  asJson () {
    let json;

    try {
      json = JSON.stringify(this.asObject());
    } catch (error) {
      json = '';
    }

    return json;
  }
}
