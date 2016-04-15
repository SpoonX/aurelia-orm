'use strict';

System.register(['../orm-metadata'], function (_export, _context) {
  var OrmMetadata;
  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {
      function repository(repositoryReference) {
        return function (target) {
          OrmMetadata.forTarget(target).put('repository', repositoryReference);
        };
      }

      _export('repository', repository);
    }
  };
});