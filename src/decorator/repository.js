import {OrmMetadata} from '../orm-metadata';

/**
 * Set the repositoryReference metadata on the entity
 *
 * @param {string} repositoryReference The repository reference to use
 *
 * @return {function}
 *
 * @decorator
 */
export function repository(repositoryReference) {
  return function(target) {
    OrmMetadata.forTarget(target).put('repository', repositoryReference);
  };
}
