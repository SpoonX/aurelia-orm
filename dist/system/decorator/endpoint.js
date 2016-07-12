'use strict';

System.register(['../aurelia-orm', '../orm-metadata'], function (_export, _context) {
  "use strict";

  var logger, OrmMetadata;
  return {
    setters: [function (_aureliaOrm) {
      logger = _aureliaOrm.logger;
    }, function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {
      function endpoint(entityEndpoint) {
        return function (target) {
          if (!OrmMetadata.forTarget(target).fetch('resource')) {
            logger.warn('Need to set the resource before setting the endpoint!');
          }

          OrmMetadata.forTarget(target).put('endpoint', entityEndpoint);
        };
      }

      _export('endpoint', endpoint);
    }
  };
});