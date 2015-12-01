import {metadata} from 'aurelia-metadata';
import {AssociationMetaData} from './association-metadata';

export function association (entity) {
  return function (target, propertyName) {
    let associations = metadata.getOrCreateOwn(AssociationMetaData.key, AssociationMetaData, target);

    associations.add(propertyName, entity);
  }
}
