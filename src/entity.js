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

  save () {
    if (this.id) {
      return this.update();
    }

    return this.api.create(this.resource, this.asObject());
  }

  setData (data) {
    Object.assign(this, data);

    return this;
  }

  setResource (resource) {
    Object.defineProperty(this, 'resource', {
      value     : resource,
      writable  : false,
      enumerable: false
    });

    return this;
  }

  update () {
    if (!this.id) {
      throw new Error('Required value "id" missing on entity.');
    }

    return this.api.update(this.resource, this.id, this.asObject());
  }

  enableValidation () {
    Object.defineProperty(this, 'validation', {
      value     : this.validator.on(this),
      writable  : false,
      enumerable: false
    });

    return this;
  }

  asObject () {
    let pojo = {};

    Object.keys(this).forEach(propertyName => {
      pojo[propertyName] = this[propertyName];
    });

    return pojo;
  }

  asJson () {
    let json;

    try {
      json = JSON.stringify(this.asObject());
    } catch (error) {
      json = null;
    }

    return json;
  }
}
