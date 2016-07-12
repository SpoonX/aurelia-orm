define(['exports', 'aurelia-dependency-injection', 'aurelia-binding', 'aurelia-templating', '../entity-manager', '../entity', '../orm-metadata', 'extend'], function (exports, _aureliaDependencyInjection, _aureliaBinding, _aureliaTemplating, _entityManager, _entity, _ormMetadata, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AssociationSelect = undefined;

  var _extend2 = _interopRequireDefault(_extend);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;

  var AssociationSelect = exports.AssociationSelect = (_dec = (0, _aureliaTemplating.customElement)('association-select'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaBinding.BindingEngine, _entityManager.EntityManager, Element), _dec3 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.twoWay }), _dec(_class = _dec2(_class = (_class2 = function () {
    function AssociationSelect(bindingEngine, entityManager, element) {
      _classCallCheck(this, AssociationSelect);

      _initDefineProp(this, 'criteria', _descriptor, this);

      _initDefineProp(this, 'repository', _descriptor2, this);

      _initDefineProp(this, 'property', _descriptor3, this);

      _initDefineProp(this, 'options', _descriptor4, this);

      _initDefineProp(this, 'association', _descriptor5, this);

      _initDefineProp(this, 'manyAssociation', _descriptor6, this);

      _initDefineProp(this, 'value', _descriptor7, this);

      this.multiple = false;

      this._subscriptions = [];
      this.bindingEngine = bindingEngine;
      this.entityManager = entityManager;
      this.multiple = typeof element.getAttribute('multiple') === 'string';
      this.element = element;
    }

    AssociationSelect.prototype.load = function load(reservedValue) {
      var _this = this;

      return this.buildFind().then(function (options) {
        var result = options;
        _this.options = Array.isArray(result) ? result : [result];

        _this.setValue(reservedValue);
      });
    };

    AssociationSelect.prototype.setValue = function setValue(value) {
      if (!value) {
        return;
      }

      if (!Array.isArray(value)) {
        this.value = value;

        return;
      }

      var selectedValues = [];

      value.forEach(function (selected) {
        selectedValues.push(selected instanceof _entity.Entity ? selected.id : selected);
      });

      this.value = selectedValues;
    };

    AssociationSelect.prototype.getCriteria = function getCriteria() {
      if (_typeof(this.criteria) !== 'object') {
        return {};
      }

      return (0, _extend2.default)(true, {}, this.criteria);
    };

    AssociationSelect.prototype.buildFind = function buildFind() {
      var _this2 = this;

      var repository = this.repository;
      var criteria = this.getCriteria();
      var findPath = repository.getResource();
      criteria.populate = false;

      if (this.manyAssociation) {
        var assoc = this.manyAssociation;

        delete criteria.populate;

        var property = this.propertyForResource(assoc.getMeta(), repository.getResource());
        findPath = assoc.getResource() + '/' + assoc.id + '/' + property;
      } else if (this.association) {
        var associations = Array.isArray(this.association) ? this.association : [this.association];

        associations.forEach(function (association) {
          criteria[_this2.propertyForResource(_this2.ownMeta, association.getResource())] = association.id;
        });
      }

      return repository.findPath(findPath, criteria);
    };

    AssociationSelect.prototype.verifyAssociationValues = function verifyAssociationValues() {
      if (this.manyAssociation) {
        return !!this.manyAssociation.id;
      }

      if (this.association) {
        var associations = Array.isArray(this.association) ? this.association : [this.association];

        return !associations.some(function (association) {
          return !association.id;
        });
      }

      return true;
    };

    AssociationSelect.prototype.observe = function observe(association) {
      var _this3 = this;

      if (Array.isArray(association)) {
        association.forEach(function (assoc) {
          return _this3.observe(assoc);
        });

        return this;
      }

      this._subscriptions.push(this.bindingEngine.propertyObserver(association, 'id').subscribe(function () {
        if (_this3.verifyAssociationValues()) {
          return _this3.load();
        }

        _this3.options = undefined;
      }));

      return this;
    };

    AssociationSelect.prototype.attached = function attached() {
      if (!this.repository && this.element.hasAttribute('resource')) {
        this.repository = this.entityManager.getRepository(this.element.getAttribute('resource'));
      }

      if (!this.association && !this.manyAssociation) {
        this.load(this.value);

        return;
      }

      this.ownMeta = _ormMetadata.OrmMetadata.forTarget(this.entityManager.resolveEntityReference(this.repository.getResource()));

      if (this.manyAssociation) {
        this.observe(this.manyAssociation);
      }

      if (this.association) {
        this.observe(this.association);
      }

      if (this.value) {
        this.load(this.value);
      }
    };

    AssociationSelect.prototype.propertyForResource = function propertyForResource(meta, resource) {
      var associations = meta.fetch('associations');

      return Object.keys(associations).filter(function (key) {
        return associations[key].entity === resource;
      })[0];
    };

    AssociationSelect.prototype.unbind = function unbind() {
      this._subscriptions.forEach(function (subscription) {
        return subscription.dispose();
      });
    };

    return AssociationSelect;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'criteria', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'repository', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'property', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 'name';
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'options', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'association', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'manyAssociation', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'value', [_dec3], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class);
});