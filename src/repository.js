import {Container} from 'aurelia-dependency-injection';
import {inject} from 'aurelia-framework';
import {Rest} from 'spoonx/aurelia-api';

@inject(Rest, Container)
export class Repository {
  constructor (restClient, container) {
    this.api       = restClient;
    this.container = container;
  }

  setEntity (entity) {
    this.entity = entity;

    return this;
  }

  find (criteria, raw) {
    let findQuery = this.api.find(this.entity.resource, criteria);

    if (raw) {
      return findQuery;
    }

    return findQuery.then(x => this.populateEntities(x));
  }

  count (criteria) {
    return this.api.find(this.entity.resource + '/count', criteria);
  }

  create (data) {
    this.getPopulatedEntity(data);
  }

  populateEntities (data) {
    if (!data) {
      return null;
    }

    if (!Array.isArray(data)){
      return this.getPopulatedEntity(data);
    }

    let collection = [];

    data.forEach(entity => {
      collection.push(this.getPopulatedEntity(entity));
    });

    return collection;
  }

  getPopulatedEntity (data) {
    return this.getNewEntity().setData(data);
  }

  getNewEntity () {
    return this.container.get(this.entity);
  }
}
