var _dec, _dec2, _class;

import { Validation } from 'aurelia-validation';
import { transient, inject } from 'aurelia-dependency-injection';
import { OrmMetadata } from './orm-metadata';

export let Entity = (_dec = transient(), _dec2 = inject(Validation), _dec(_class = _dec2(_class = class Entity {
  constructor(validator) {
    this.define('__meta', OrmMetadata.forTarget(this.constructor)).define('__cleanValues', {}, true);

    if (!this.hasValidation()) {
      return this;
    }

    return this.define('__validator', validator);
  }

  getTransport() {
    return this.getRepository().getTransport();
  }

  getRepository() {
    return this.__repository;
  }

  setRepository(repository) {
    return this.define('__repository', repository);
  }

  define(property, value, writable) {
    Object.defineProperty(this, property, {
      value: value,
      writable: !!writable,
      enumerable: false
    });

    return this;
  }

  getMeta() {
    return this.__meta;
  }

  save() {
    if (!this.isNew()) {
      return this.update();
    }

    let response;
    return this.getTransport().create(this.getResource(), this.asObject(true)).then(created => {
      this.id = created.id;
      response = created;
    }).then(() => this.saveCollections()).then(() => this.markClean()).then(() => response);
  }

  update() {
    if (this.isNew()) {
      throw new Error('Required value "id" missing on entity.');
    }

    if (this.isClean()) {
      return this.saveCollections().then(() => this.markClean()).then(() => null);
    }

    let requestBody = this.asObject(true);
    let response;

    delete requestBody.id;

    return this.getTransport().update(this.getResource(), this.id, requestBody).then(updated => response = updated).then(() => this.saveCollections()).then(() => this.markClean()).then(() => response);
  }

  addCollectionAssociation(entity, property) {
    property = property || getPropertyForAssociation(this, entity);
    let url = [this.getResource(), this.id, property];

    if (this.isNew()) {
      throw new Error('Cannot add association to entity that does not have an id.');
    }

    if (!(entity instanceof Entity)) {
      url.push(entity);

      return this.getTransport().create(url.join('/'));
    }

    if (entity.isNew()) {
      let associationProperty = getPropertyForAssociation(entity, this);
      let relation = entity.getMeta().fetch('association', associationProperty);

      if (!relation || relation.type !== 'entity') {
        return entity.save().then(() => {
          return this.addCollectionAssociation(entity, property);
        });
      }

      entity[associationProperty] = this.id;

      return entity.save().then(() => {
        return entity;
      });
    }

    url.push(entity.id);

    return this.getTransport().create(url.join('/')).then(() => {
      return entity;
    });
  }

  removeCollectionAssociation(entity, property) {
    property = property || getPropertyForAssociation(this, entity);
    let idToRemove = entity;

    if (entity instanceof Entity) {
      if (!entity.id) {
        return Promise.resolve(null);
      }

      idToRemove = entity.id;
    }

    return this.getTransport().destroy([this.getResource(), this.id, property, idToRemove].join('/'));
  }

  saveCollections() {
    let tasks = [];
    let currentCollections = getCollectionsCompact(this, true);
    let cleanCollections = this.__cleanValues.data ? this.__cleanValues.data.collections : null;

    let addTasksForDifferences = (base, candidate, method) => {
      if (base === null) {
        return;
      }

      Object.getOwnPropertyNames(base).forEach(property => {
        base[property].forEach(id => {
          if (candidate === null || !Array.isArray(candidate[property]) || candidate[property].indexOf(id) === -1) {
            tasks.push(method.call(this, id, property));
          }
        });
      });
    };

    addTasksForDifferences(currentCollections, cleanCollections, this.addCollectionAssociation);

    addTasksForDifferences(cleanCollections, currentCollections, this.removeCollectionAssociation);

    return Promise.all(tasks).then(results => this);
  }

  markClean() {
    let cleanValues = getFlat(this);
    this.__cleanValues = {
      checksum: JSON.stringify(cleanValues),
      data: cleanValues
    };

    return this;
  }

  isClean() {
    return getFlat(this, true) === this.__cleanValues.checksum;
  }

  isDirty() {
    return !this.isClean();
  }

  isNew() {
    return typeof this.id === 'undefined';
  }

  static getResource() {
    return OrmMetadata.forTarget(this).fetch('resource');
  }

  getResource() {
    return this.__resource || this.getMeta().fetch('resource');
  }

  setResource(resource) {
    return this.define('__resource', resource);
  }

  destroy() {
    if (!this.id) {
      throw new Error('Required value "id" missing on entity.');
    }

    return this.getTransport().destroy(this.getResource(), this.id);
  }

  getName() {
    let metaName = this.getMeta().fetch('name');

    if (metaName) {
      return metaName;
    }

    return this.getResource();
  }

  static getName() {
    let metaName = OrmMetadata.forTarget(this).fetch('name');

    if (metaName) {
      return metaName;
    }

    return this.getResource();
  }

  setData(data) {
    Object.assign(this, data);

    return this;
  }

  enableValidation() {
    if (!this.hasValidation()) {
      throw new Error('Entity not marked as validated. Did you forget the @validation() decorator?');
    }

    if (this.__validation) {
      return this;
    }

    return this.define('__validation', this.__validator.on(this));
  }

  getValidation() {
    if (!this.hasValidation()) {
      return null;
    }

    if (!this.__validation) {
      this.enableValidation();
    }

    return this.__validation;
  }

  hasValidation() {
    return !!this.getMeta().fetch('validation');
  }

  asObject(shallow) {
    return asObject(this, shallow);
  }

  asJson(shallow) {
    return asJson(this, shallow);
  }
}) || _class) || _class);

function asObject(entity, shallow) {
  let pojo = {};
  let metadata = entity.getMeta();

  Object.keys(entity).forEach(propertyName => {
    let value = entity[propertyName];
    let association = metadata.fetch('associations', propertyName);

    if (!association || !value) {
      pojo[propertyName] = value;

      return;
    }

    if (shallow) {
      if (association.type === 'collection') {
        return;
      }

      if (value.id) {
        pojo[propertyName] = value.id;
      } else if (value instanceof Entity) {
        pojo[propertyName] = value.asObject();
      } else if (['string', 'number', 'boolean'].indexOf(typeof value) > -1 || value.constructor === Object) {
        pojo[propertyName] = value;
      }

      return;
    }

    if (!Array.isArray(value)) {
      pojo[propertyName] = !(value instanceof Entity) ? value : value.asObject(shallow);

      return;
    }

    let asObjects = [];

    value.forEach(childValue => {
      if (typeof childValue !== 'object') {
        return;
      }

      if (!(childValue instanceof Entity)) {
        asObjects.push(childValue);

        return;
      }

      if (!shallow || typeof childValue === 'object' && !childValue.id) {
        asObjects.push(childValue.asObject(shallow));
      }
    });

    if (asObjects.length > 0) {
      pojo[propertyName] = asObjects;
    }
  });

  return pojo;
}

function asJson(entity, shallow) {
  let json;

  try {
    json = JSON.stringify(asObject(entity, shallow));
  } catch (error) {
    json = '';
  }

  return json;
}

function getCollectionsCompact(forEntity, includeNew) {
  let associations = forEntity.getMeta().fetch('associations');
  let collections = {};

  Object.getOwnPropertyNames(associations).forEach(index => {
    let association = associations[index];

    if (association.type !== 'collection') {
      return;
    }

    collections[index] = [];

    if (!Array.isArray(forEntity[index])) {
      return;
    }

    forEntity[index].forEach(entity => {
      if (typeof entity === 'number') {
        collections[index].push(entity);

        return;
      }

      if (entity.id) {
        collections[index].push(entity.id);
      } else if (includeNew && entity instanceof Entity) {
        collections[index].push(entity);
      }
    });
  });

  return collections;
}

function getFlat(entity, json) {
  let flat = {
    entity: asObject(entity, true),
    collections: getCollectionsCompact(entity)
  };

  if (json) {
    flat = JSON.stringify(flat);
  }

  return flat;
}

function getPropertyForAssociation(forEntity, entity) {
  let associations = forEntity.getMeta().fetch('associations');

  return Object.keys(associations).filter(key => {
    return associations[key].entity === entity.getResource();
  })[0];
}