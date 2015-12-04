System.register(['./resource', './validation'], function (_export) {
  'use strict';

  var resource, validation;

  _export('validatedResource', validatedResource);

  function validatedResource(resourceName) {
    return function (target, propertyName) {
      resource(resourceName)(target);
      validation()(target, propertyName);
    };
  }

  return {
    setters: [function (_resource) {
      resource = _resource.resource;
    }, function (_validation) {
      validation = _validation.validation;
    }],
    execute: function () {}
  };
});