import {OrmMetadata} from '../orm-metadata';

export function resource (resourceName) {
  return function (target) {
    OrmMetadata.forTarget(target).put('resource', resourceName || target.name.toLowerCase());
  }
}
