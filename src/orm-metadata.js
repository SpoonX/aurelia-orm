import {metadata} from 'aurelia-metadata';
import {DefaultRepository} from './default-repository';

export class OrmMetadata {
  static forTarget(target) {
    return metadata.getOrCreateOwn(Metadata.key, Metadata, target, target.name);
  }
}

/**
 * The MetaData class for Entity and Repository
 *
 */
export class Metadata {
  // The key used to identify this specific metadata
  static key = 'spoonx:orm:metadata';

  /**
   * Construct metadata with sensible defaults (so we can make assumptions in the code).
   */
  constructor() {
    this.metadata = {
      repository: DefaultRepository,
      resource: null,
      endpoint: null,
      name: null,
      idProperty: 'id',
      associations: {}
    };
  }

  /**
   * Add a value to an array.
   *
   * @param {string} key
   * @param {*} value
   *
   * @return {Metadata} this
   * @chainable
*/
  addTo(key, value) {
    if (typeof this.metadata[key] === 'undefined') {
      this.metadata[key] = [];
    } else if (!Array.isArray(this.metadata[key])) {
      this.metadata[key] = [this.metadata[key]];
    }

    this.metadata[key].push(value);

    return this;
  }

  /**
   * Set a value for key, or one level deeper (key.key).
   *
   * @param {string} key
   * @param {string|*} valueOrNestedKey
   * @param {null|*} [valueOrNull]
   *
   * @return {Metadata} this
   * @chainable
   */
  put(key, valueOrNestedKey, valueOrNull) {
    if (!valueOrNull) {
      this.metadata[key] = valueOrNestedKey;

      return this;
    }

    if (typeof this.metadata[key] !== 'object') {
      this.metadata[key] = {};
    }

    this.metadata[key][valueOrNestedKey] = valueOrNull;

    return this;
  }

  /**
   * Check if key, or key.nested exists.
   *
   * @param {string} key
   * @param {string} [nested]
   *
   * @return {boolean}
   */
  has(key, nested) {
    if (typeof nested === 'undefined') {
      return typeof this.metadata[key] !== 'undefined';
    }

    return typeof this.metadata[key] !== 'undefined' && typeof this.metadata[key][nested] !== 'undefined';
  }

  /**
   * Fetch key or key.nested from metadata.
   *
   * @param {string} key
   * @param {string} [nested]
   *
   * @return {*}
   */
  fetch(key, nested) {
    if (!nested) {
      return this.has(key) ? this.metadata[key] : null;
    }

    if (!this.has(key, nested)) {
      return null;
    }

    return this.metadata[key][nested];
  }
}
