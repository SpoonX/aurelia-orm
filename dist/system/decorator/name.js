'use strict';

System.register(['../orm-metadata'], function (_export, _context) {
  "use strict";

  var OrmMetadata;
  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {
      function name(entityName) {
        return function (target) {
          OrmMetadata.forTarget(target).put('name', entityName || target.name.toLowerCase());
        };
      }

      _export('name', name);
    }
  };
});