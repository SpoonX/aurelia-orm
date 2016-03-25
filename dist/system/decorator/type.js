'use strict';

System.register(['../orm-metadata'], function (_export, _context) {
  var OrmMetadata;
  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {
      function type(typeValue) {
        return function (target, propertyName) {
          OrmMetadata.forTarget(target.constructor).put('types', propertyName, typeValue);
        };
      }

      _export('type', type);
    }
  };
});