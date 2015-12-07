import {OrmMetadata} from '../orm-metadata';

export function repository(repository) {
  return function (target) {
    OrmMetadata.forTarget(target).put('repository', repository);
  }
}
