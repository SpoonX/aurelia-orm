define(['exports', 'aurelia-framework', 'aurelia-binding', 'aurelia-templating', '../index', 'extend'], function (exports, _aureliaFramework, _aureliaBinding, _aureliaTemplating, _index, _extend) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

  var _extend2 = _interopRequireDefault(_extend);

  var AssociationSelect = (function () {
    var _instanceInitializers = {};
    var _instanceInitializers = {};

    _createDecoratedClass(AssociationSelect, [{
      key: 'criteria',
      decorators: [_aureliaFramework.bindable],
      initializer: function initializer() {
        return null;
      },
      enumerable: true
    }, {
      key: 'repository',
      decorators: [_aureliaFramework.bindable],
      initializer: null,
      enumerable: true
    }, {
      key: 'property',
      decorators: [_aureliaFramework.bindable],
      initializer: function initializer() {
        return 'name';
      },
      enumerable: true
    }, {
      key: 'options',
      decorators: [_aureliaFramework.bindable],
      initializer: null,
      enumerable: true
    }, {
      key: 'association',
      decorators: [_aureliaFramework.bindable],
      initializer: null,
      enumerable: true
    }, {
      key: 'manyAssociation',
      decorators: [_aureliaFramework.bindable],
      initializer: null,
      enumerable: true
    }, {
      key: 'value',
      decorators: [(0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.twoWay })],
      initializer: null,
      enumerable: true
    }], null, _instanceInitializers);

    function AssociationSelect(bindingEngine, entityManager, element) {
      _classCallCheck(this, _AssociationSelect);

      _defineDecoratedPropertyDescriptor(this, 'criteria', _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, 'repository', _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, 'property', _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, 'options', _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, 'association', _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, 'manyAssociation', _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, 'value', _instanceInitializers);

      this.multiple = false;

      this._subscriptions = [];
      this.bindingEngine = bindingEngine;
      this.entityManager = entityManager;
      this.multiple = typeof element.getAttribute('multiple') === 'string';
    }

    _createDecoratedClass(AssociationSelect, [{
      key: 'load',
      value: function load(reservedValue) {
        var _this = this;

        return this.buildFind().then(function (options) {
          var result = options;
          _this.options = Array.isArray(result) ? result : [result];

          _this.setValue(reservedValue);
        });
      }
    }, {
      key: 'setValue',
      value: function setValue(value) {
        if (!value) {
          return;
        }

        if (!Array.isArray(value)) {
          this.value = value;

          return;
        }

        var selectedValues = [];

        value.forEach(function (selected) {
          selectedValues.push(selected instanceof _index.Entity ? selected.id : selected);
        });

        this.value = selectedValues;
      }
    }, {
      key: 'getCriteria',
      value: function getCriteria() {
        if (typeof this.criteria !== 'object') {
          return {};
        }

        return (0, _extend2['default'])(true, {}, this.criteria);
      }
    }, {
      key: 'buildFind',
      value: function buildFind() {
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
      }
    }, {
      key: 'verifyAssociationValues',
      value: function verifyAssociationValues() {
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
      }
    }, {
      key: 'observe',
      value: function observe(association) {
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
      }
    }, {
      key: 'attached',
      value: function attached() {
        if (!this.association && !this.manyAssociation) {
          this.load(this.value);

          return;
        }

        this.ownMeta = _index.OrmMetadata.forTarget(this.entityManager.resolveEntityReference(this.repository.getResource()));

        if (this.manyAssociation) {
          this.observe(this.manyAssociation);
        }

        if (this.association) {
          this.observe(this.association);
        }

        if (this.value) {
          this.load(this.value);
        }
      }
    }, {
      key: 'propertyForResource',
      value: function propertyForResource(meta, resource) {
        var associations = meta.fetch('associations');

        return Object.keys(associations).filter(function (key) {
          return associations[key].entity === resource;
        })[0];
      }
    }, {
      key: 'unbind',
      value: function unbind() {
        this._subscriptions.forEach(function (subscription) {
          return subscription.dispose();
        });
      }
    }], null, _instanceInitializers);

    var _AssociationSelect = AssociationSelect;
    AssociationSelect = (0, _aureliaFramework.inject)(_aureliaBinding.BindingEngine, _index.EntityManager, Element)(AssociationSelect) || AssociationSelect;
    AssociationSelect = (0, _aureliaTemplating.customElement)('association-select')(AssociationSelect) || AssociationSelect;
    return AssociationSelect;
  })();

  exports.AssociationSelect = AssociationSelect;
});