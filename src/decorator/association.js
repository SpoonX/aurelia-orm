import {OrmMetadata} from '../orm-metadata';
import {ensurePropertyIsConfigurable} from './utils';

/**
 * Associate a property with an entity (toOne) or a collection (toMany)
 *
 * @param {undefined|String|Object} associationData undefined={entity:propertyName}, String={entity:String}, Object={entity: String, collection: String}
 *
 * @return {Function}
 *
 * @decorator
 */
export function association(associationData) {
  return function(target, propertyName, descriptor) {
    ensurePropertyIsConfigurable(target, propertyName, descriptor);

    if (!associationData) {
      associationData = {entity: propertyName};
    } else if (typeof associationData === 'string') {
      associationData = {entity: associationData};
    }

    OrmMetadata.forTarget(target.constructor).put('associations', propertyName, {
      type: associationData.entity ? 'entity' : 'collection',
      entity: associationData.entity || associationData.collection
    });
  };
}
