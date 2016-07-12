'use strict';

System.register(['../aurelia-orm', '../orm-metadata'], function (_export, _context) {
  "use strict";

  var logger, OrmMetadata, _typeof;

  return {
    setters: [function (_aureliaOrm) {
      logger = _aureliaOrm.logger;
    }, function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
      };
      function data(metaData) {
        return function (target, propertyName) {
          if ((typeof metaData === 'undefined' ? 'undefined' : _typeof(metaData)) !== 'object') {
            logger.error('data must be an object, ' + (typeof metaData === 'undefined' ? 'undefined' : _typeof(metaData)) + ' given.');
          }

          OrmMetadata.forTarget(target.constructor).put('data', propertyName, metaData);
        };
      }

      _export('data', data);
    }
  };
});