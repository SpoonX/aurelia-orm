System.register(['aurelia-validation', '../index'], function (_export) {
  'use strict';

  var ValidationRule, Entity, HasAssociationValidationRule;

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  return {
    setters: [function (_aureliaValidation) {
      ValidationRule = _aureliaValidation.ValidationRule;
    }, function (_index) {
      Entity = _index.Entity;
    }],
    execute: function () {
      HasAssociationValidationRule = (function (_ValidationRule) {
        _inherits(HasAssociationValidationRule, _ValidationRule);

        function HasAssociationValidationRule() {
          _classCallCheck(this, HasAssociationValidationRule);

          _get(Object.getPrototypeOf(HasAssociationValidationRule.prototype), 'constructor', this).call(this, null, function (value) {
            return !!(value instanceof Entity && typeof value.id === 'number' || typeof value === 'number');
          }, null, 'isRequired');
        }

        return HasAssociationValidationRule;
      })(ValidationRule);

      _export('HasAssociationValidationRule', HasAssociationValidationRule);
    }
  };
});