'use strict';

System.register(['./resource', './validation'], function (_export, _context) {
  var resource, validation;
  return {
    setters: [function (_resource) {
      resource = _resource.resource;
    }, function (_validation) {
      validation = _validation.validation;
    }],
    execute: function () {
      function validatedResource(resourceName) {
        return function (target, propertyName) {
          resource(resourceName)(target);
          validation()(target, propertyName);
        };
      }

      _export('validatedResource', validatedResource);
    }
  };
});