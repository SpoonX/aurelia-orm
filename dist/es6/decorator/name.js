import {OrmMetadata} from '../orm-metadata';

export function name(entityName) {
  return function(target) {
    OrmMetadata.forTarget(target).put('name', entityName || target.name.toLowerCase());
  };
}
