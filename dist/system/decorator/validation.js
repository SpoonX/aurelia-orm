System.register(['../orm-metadata'], function (_export) {
  'use strict';

  var OrmMetadata;

  _export('validation', validation);

  function validation() {
    return function (target) {
      OrmMetadata.forTarget(target).put('validation', true);
    };
  }

  return {
    setters: [function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {}
  };
});