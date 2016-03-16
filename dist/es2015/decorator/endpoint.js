import { OrmMetadata } from '../orm-metadata';

export function endpoint(entityEndpoint) {
  return function (target) {
    OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
  };
}