import {OrmMetadata} from '../orm-metadata';
import {Validator} from 'aurelia-validation';

/**
 * Set the 'validation' metadata to 'true'
 *
 * @param {[function]} ValidatorClass = Validator
 *
 * @return {Function}
 *
 * @decorator
 */
export function validation(ValidatorClass = Validator) {
  return function(target) {
    OrmMetadata.forTarget(target).put('validation', ValidatorClass);
  };
}
