System.register(['aurelia-framework', './repository'], function (_export) {
  'use strict';

  var transient, Repository, DefaultRepository;

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  return {
    setters: [function (_aureliaFramework) {
      transient = _aureliaFramework.transient;
    }, function (_repository) {
      Repository = _repository.Repository;
    }],
    execute: function () {
      DefaultRepository = (function (_Repository) {
        _inherits(DefaultRepository, _Repository);

        function DefaultRepository() {
          _classCallCheck(this, _DefaultRepository);

          _get(Object.getPrototypeOf(_DefaultRepository.prototype), 'constructor', this).apply(this, arguments);
        }

        var _DefaultRepository = DefaultRepository;
        DefaultRepository = transient()(DefaultRepository) || DefaultRepository;
        return DefaultRepository;
      })(Repository);

      _export('DefaultRepository', DefaultRepository);
    }
  };
});