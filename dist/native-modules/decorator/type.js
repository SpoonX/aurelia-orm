import { OrmMetadata } from '../orm-metadata';

export function type(typeValue) {
  return function (target, propertyName) {
    OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
  };
}