import {OrmMetadata} from '../orm-metadata';

export function name(resourceName) {
  return function(target) {
    OrmMetadata.forTarget(target).put('name', resourceName || target.name.toLowerCase());
  };
}
