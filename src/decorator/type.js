import {OrmMetadata} from '../orm-metadata';
import {ensurePropertyIsConfigurable} from './utils';

/**
 * Set the 'types' metadata on the entity
 *
 * @param {string} typeValue The type(text,string,date,datetime,integer,int,number,float,boolean,bool,smart,autodetect (based on value)) to use for this property using typer
 *
 * @return {function}
 *
 * @decorator
 */
export function type(typeValue) {
  return function(target, propertyName, descriptor) {
    ensurePropertyIsConfigurable(target, propertyName, descriptor);

    OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
  };
}
