'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaOrm = require('./aurelia-orm');

Object.keys(_aureliaOrm).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaOrm[key];
    }
  });
});