'use strict';

System.register(['get-prop', 'aurelia-dependency-injection', 'aurelia-binding', 'aurelia-templating', '../aurelia-orm', 'extend'], function (_export, _context) {
  "use strict";

  var getProp, inject, bindingMode, BindingEngine, bindable, customElement, EntityManager, Entity, OrmMetadata, logger, extend, _typeof, _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, AssociationSelect;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
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

  return {
    setters: [function (_getProp) {
      getProp = _getProp.default;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
      BindingEngine = _aureliaBinding.BindingEngine;
    }, function (_aureliaTemplating) {
      bindable = _aureliaTemplating.bindable;
      customElement = _aureliaTemplating.customElement;
    }, function (_aureliaOrm) {
      EntityManager = _aureliaOrm.EntityManager;
      Entity = _aureliaOrm.Entity;
      OrmMetadata = _aureliaOrm.OrmMetadata;
      logger = _aureliaOrm.logger;
    }, function (_extend) {
      extend = _extend.default;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
      };

      _export('AssociationSelect', AssociationSelect = (_dec = customElement('association-select'), _dec2 = inject(BindingEngine, EntityManager, Element), _dec3 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec(_class = _dec2(_class = (_class2 = function () {
        function AssociationSelect(bindingEngine, entityManager, element) {
          

          _initDefineProp(this, 'criteria', _descriptor, this);

          _initDefineProp(this, 'repository', _descriptor2, this);

          _initDefineProp(this, 'identifier', _descriptor3, this);

          _initDefineProp(this, 'property', _descriptor4, this);

          _initDefineProp(this, 'resource', _descriptor5, this);

          _initDefineProp(this, 'options', _descriptor6, this);

          _initDefineProp(this, 'association', _descriptor7, this);

          _initDefineProp(this, 'manyAssociation', _descriptor8, this);

          _initDefineProp(this, 'value', _descriptor9, this);

          _initDefineProp(this, 'multiple', _descriptor10, this);

          this._subscriptions = [];
          this.bindingEngine = bindingEngine;
          this.entityManager = entityManager;
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
            this.value = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? getProp(value, this.identifier || 'id') : value;

            return;
          }

          var selectedValues = [];

          value.forEach(function (selected) {
            selectedValues.push(selected instanceof Entity ? selected.id : selected);
          });

          this.value = selectedValues;
        };

        AssociationSelect.prototype.getCriteria = function getCriteria() {
          if (_typeof(this.criteria) !== 'object') {
            return {};
          }

          return extend(true, {}, this.criteria);
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

            return Promise.resolve();
          }));

          return this;
        };

        AssociationSelect.prototype.resourceChanged = function resourceChanged(resource) {
          if (!resource) {
            logger.error('resource is ' + (typeof resource === 'undefined' ? 'undefined' : _typeof(resource)) + '. It should be a string or a reference');
          }

          this.repository = this.entityManager.getRepository(resource);
        };

        AssociationSelect.prototype.attached = function attached() {
          if (!this.association && !this.manyAssociation) {
            this.load(this.value);

            return;
          }

          this.ownMeta = OrmMetadata.forTarget(this.entityManager.resolveEntityReference(this.repository.getResource()));

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
      }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'criteria', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'repository', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'identifier', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'property', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return 'name';
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'resource', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'options', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'association', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'manyAssociation', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'value', [_dec3], {
        enumerable: true,
        initializer: null
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'multiple', [bindable], {
        enumerable: true,
        initializer: function initializer() {
          return false;
        }
      })), _class2)) || _class) || _class));

      _export('AssociationSelect', AssociationSelect);
    }
  };
});