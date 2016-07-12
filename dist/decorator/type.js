import {OrmMetadata} from '../orm-metadata';

/**
 * Set the 'types' metadata on the entity
 *
 * @param {String} typeValue The type(text,string,date,datetime,integer,int,number,float,boolean,bool,smart,autodetect (based on value)) to use for this property using typer
 *
 * @return {Function}
 *
 * @decorator
 */
export function type(typeValue) {
  return function(target, propertyName) {
    OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
  };
}
