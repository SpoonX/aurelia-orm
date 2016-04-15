import { resource } from './resource';
import { validation } from './validation';

export function validatedResource(resourceName) {
  return function (target, propertyName) {
    resource(resourceName)(target);
    validation()(target, propertyName);
  };
}