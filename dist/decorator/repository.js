import {OrmMetadata} from '../orm-metadata';

/**
 * Set the repositoryReference metadata on the entity
 *
 * @param {String} repositoryReference The repository reference to use
 *
 * @return {Function}
 *
 * @decorator
 */
export function repository(repositoryReference) {
  return function(target) {
    OrmMetadata.forTarget(target).put('repository', repositoryReference);
  };
}
