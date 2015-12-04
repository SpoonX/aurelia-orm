System.register(['../orm-metadata'], function (_export) {
  'use strict';

  var OrmMetadata;

  _export('repository', repository);

  function repository(repository) {
    return function (target) {
      OrmMetadata.forTarget(target).put('repository', repository);
    };
  }

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {}
  };
});