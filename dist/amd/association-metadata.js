define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var AssociationMetaData = (function () {
    _createClass(AssociationMetaData, null, [{
      key: 'key',
      value: 'orm:entity:associations',
      enumerable: true
    }]);

    function AssociationMetaData() {
      _classCallCheck(this, AssociationMetaData);

      this.associations = {};
    }

    _createClass(AssociationMetaData, [{
      key: 'add',
      value: function add(association, reference) {
        this.associations[association] = reference;
      }
    }, {
      key: 'has',
      value: function has(reference) {
        return typeof this.associations[reference] !== 'undefined';
      }
    }, {
      key: 'fetch',
      value: function fetch(association) {
        return this.associations[association];
      }
    }]);

    return AssociationMetaData;
  })();

  exports.AssociationMetaData = AssociationMetaData;
});