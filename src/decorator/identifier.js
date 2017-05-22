import {OrmMetadata} from '../orm-metadata';

/**
 * Set the 'identifierName' metadata on the entity
 *
 * @param {string} identifierName The name of the identifier
 *
 * @return {function}
 *
 * @decorator
 */
export function identifier(identifierName) {
  return function(target) {
    OrmMetadata.forTarget(target).put('identifier', identifierName || target.name.toLowerCase());
  };
}
