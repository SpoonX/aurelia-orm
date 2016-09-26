import {OrmMetadata} from '../orm-metadata';
import {observable} from 'aurelia-binding';

/**
 * Set the 'types' metadata on the entity. Also makes it observable
 *
 * @param {String} typeValue The type(text,string,date,datetime,integer,int,number,float,boolean,bool,smart,autodetect (based on value)) to use for this property using typer
 *
 * @return {Function}
 *
 * @decorator
 */
export function type(typeValue) {
  return function(target, propertyName, descriptor) {
    observable()(target, propertyName, descriptor);

    OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
  };
}
