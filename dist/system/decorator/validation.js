'use strict';

System.register(['../orm-metadata'], function (_export, _context) {
  var OrmMetadata;
  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {
      function validation() {
        return function (target) {
          OrmMetadata.forTarget(target).put('validation', true);
        };
      }

      _export('validation', validation);
    }
  };
});