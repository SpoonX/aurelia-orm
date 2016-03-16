'use strict';

System.register(['../orm-metadata'], function (_export, _context) {
  var OrmMetadata;
  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {
      function resource(resourceName) {
        return function (target) {
          OrmMetadata.forTarget(target).put('resource', resourceName || target.name.toLowerCase());
        };
      }

      _export('resource', resource);
    }
  };
});