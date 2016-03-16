'use strict';

System.register(['aurelia-validation', '../aurelia-orm'], function (_export, _context) {
  var ValidationRule, Entity, HasAssociationValidationRule;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_aureliaValidation) {
      ValidationRule = _aureliaValidation.ValidationRule;
    }, function (_aureliaOrm) {
      Entity = _aureliaOrm.Entity;
    }],
    execute: function () {
      _export('HasAssociationValidationRule', HasAssociationValidationRule = function (_ValidationRule) {
        _inherits(HasAssociationValidationRule, _ValidationRule);

        function HasAssociationValidationRule() {
          _classCallCheck(this, HasAssociationValidationRule);

          return _possibleConstructorReturn(this, _ValidationRule.call(this, null, function (value) {
            return !!(value instanceof Entity && typeof value.id === 'number' || typeof value === 'number');
          }, null, 'isRequired'));
        }

        return HasAssociationValidationRule;
      }(ValidationRule));

      _export('HasAssociationValidationRule', HasAssociationValidationRule);
    }
  };
});