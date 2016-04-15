var _dec, _class;

import { Entity } from './entity';
import { DefaultRepository } from './default-repository';
import { Container, inject } from 'aurelia-dependency-injection';
import { OrmMetadata } from './orm-metadata';

export let EntityManager = (_dec = inject(Container), _dec(_class = class EntityManager {
  constructor(container) {
    this.repositories = {};
    this.entities = {};

    this.container = container;
  }

  registerEntities(entities) {
    for (let reference in entities) {
      if (!entities.hasOwnProperty(reference)) {
        continue;
      }

      this.registerEntity(entities[reference]);
    }

    return this;
  }

  registerEntity(entity) {
    this.entities[OrmMetadata.forTarget(entity).fetch('resource')] = entity;

    return this;
  }

  getRepository(entity) {
    let reference = this.resolveEntityReference(entity);
    let resource = entity;

    if (typeof reference.getResource === 'function') {
      resource = reference.getResource() || resource;
    }

    if (typeof resource !== 'string') {
      throw new Error('Unable to find resource for entity.');
    }

    if (this.repositories[resource]) {
      return this.repositories[resource];
    }

    let metaData = OrmMetadata.forTarget(reference);
    let repository = metaData.fetch('repository');
    let instance = this.container.get(repository);

    if (instance.meta && instance.resource && instance.entityManager) {
      return instance;
    }

    instance.setMeta(metaData);
    instance.resource = resource;
    instance.entityManager = this;

    if (instance instanceof DefaultRepository) {
      this.repositories[resource] = instance;
    }

    return instance;
  }

  resolveEntityReference(resource) {
    let entityReference = resource;

    if (typeof resource === 'string') {
      entityReference = this.entities[resource] || Entity;
    }

    if (typeof entityReference === 'function') {
      return entityReference;
    }

    throw new Error('Unable to resolve to entity reference. Expected string or function.');
  }

  getEntity(entity) {
    let reference = this.resolveEntityReference(entity);
    let instance = this.container.get(reference);
    let resource = reference.getResource();

    if (!resource) {
      if (typeof entity !== 'string') {
        throw new Error('Unable to find resource for entity.');
      }

      resource = entity;
    }

    return instance.setResource(resource).setRepository(this.getRepository(resource));
  }
}) || _class);