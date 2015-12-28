import {Validation} from 'aurelia-validation';
import {transient, inject} from 'aurelia-framework';
import {Rest} from 'spoonx/aurelia-api';
import {OrmMetadata} from './orm-metadata';

@transient()
@inject(Validation, Rest)
export class Entity {

  /**
   * Construct a new entity.
   *
   * @param {Validation} validator
   * @param {Rest} restClient
   *
   * @return {Entity}
   */
  constructor(validator, restClient) {
    this
      .define('__api', restClient)
      .define('__meta', OrmMetadata.forTarget(this.constructor))
      .define('__cleanValues', null, true);

    // No validation? No need to set the validator.
    if (!this.hasValidation()) {
      return this;
    }

    // Set the validator.
    return this.define('__validator', validator);
  }

  /**
   * Define a non-enumerable property on the entity.
   *
   * @param {string}  property
   * @param {*}       value
   * @param {boolean} [writable]
   *
   * @return {Entity}
   */
  define(property, value, writable) {
    Object.defineProperty(this, property, {
      value: value,
      writable: !!writable,
      enumerable: false
    });

    return this;
  }

  /**
   * Get the metadata for this entity.
   *
   * return {Metadata}
   */
  getMeta() {
    return this.__meta;
  }

  /**
   * Persist the entity's state to the server.
   * Either creates a new record (POST) or updates an existing one (PUT) based on the entity's state,
   *
   * @return {Promise}
   */
  save() {
    if (this.id) {
      return this.update();
    }

    return this.__api.create(this.getResource(), this.asObject(true));
  }

  /**
   * Mark this entity as clean, in its current state.
   *
   * @return {Entity}
   */
  markClean() {
    this.__cleanValues = this.asJson(true);

    return this;
  }

  /**
   * Return if the entity is clean.
   *
   * @return {boolean}
   */
  isClean() {
    return this.__cleanValues === this.asJson(true);
  }

  /**
   * Persist the changes made to this entity to the server.
   *
   * @see .save()
   *
   * @return {Promise}
   *
   * @throws {Error}
   */
  update() {
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
  static getResource() {
    return OrmMetadata.forTarget(this).fetch('resource');
  }

  /**
   * Get the resource name of this entity instance
   *
   * @return {string|null}
   */
  getResource() {
    return this.__resource || this.getMeta().fetch('resource');
  }

  /**
   * Set this instance's resource.
   *
   * @param {string} resource
   *
   * @return {Entity} Fluent interface
   */
  setResource(resource) {
    return this.define('__resource', resource);
  }

  /**
   * Destroy this entity (DELETE request to the server).
   *
   * @return {Promise}
   */
  destroy() {
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
  setData(data) {
    Object.assign(this, data);

    return this;
  }

  /**
   * Enable validation for this entity.
   *
   * @return {Entity}
   *
   * @throws {Error}
   */
  enableValidation() {
    if (!this.hasValidation()) {
      throw new Error('Entity not marked as validated. Did you forget the @validation() decorator?');
    }

    if (this.__validation) {
      return this;
    }

    return this.define('__validation', this.__validator.on(this));
  }

  /**
   * Get the validation instance.
   *
   * @return {Validation}
   */
  getValidation() {
    if (!this.hasValidation()) {
      return null;
    }

    if (!this.__validation) {
      this.enableValidation();
    }

    return this.__validation;
  }

  /**
   * Check if entity has validation enabled.
   *
   * @return {boolean}
   */
  hasValidation() {
    return !!this.__meta.fetch('validation');
  }

  /**
   * Get the data in this entity as a POJO.
   *
   * @return {{}}
   *
   *  Now let's check if the object has an ID. If so, set that as the value.
   */
  asObject(shallow) {
    let pojo     = {};
    let metadata = this.getMeta();

    Object.keys(this).forEach(propertyName => {
      let value = this[propertyName];

      // No meta data or no association property: simple assignment.
      if (!metadata.has('associations', propertyName)) {
        pojo[propertyName] = value;

        return;
      }

      // If there's no true value set, perform a simple assignment.
      if (!value) {
        pojo[propertyName] = value;

        return;
      }

      // If shallow and is object, set id.
      if (shallow && typeof value === 'object' && value.id) {
        pojo[propertyName] = value.id;

        return;
      }

      // Array, treat children as potential entities.
      if (Array.isArray(value)) {
        let asObjects = [];

        value.forEach((childValue, index) => {
          if (!(childValue instanceof Entity)) {
            asObjects[index] = childValue;

            return;
          }

          asObjects[index] = childValue.asObject();
        });

        pojo[propertyName] = asObjects;

        return;
      }

      // Single value not an instance of entity? Simple assignment.
      if (!(value instanceof Entity)) {
        pojo[propertyName] = value;

        return;
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
  asJson(shallow) {
    let json;

    try {
      json = JSON.stringify(this.asObject(shallow));
    } catch (error) {
      json = '';
    }

    return json;
  }
}
