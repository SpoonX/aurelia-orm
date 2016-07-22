define(['exports', './aurelia-orm'], function (exports, _aureliaOrm) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_aureliaOrm).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _aureliaOrm[key];
      }
    });
  });
});