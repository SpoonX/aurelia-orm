import {OrmMetadata} from '../orm-metadata';

export function validation () {
  return function (target) {
    OrmMetadata.forTarget(target).addTo('validation', true);
  }
}
