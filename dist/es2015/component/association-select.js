var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14;

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

import getProp from 'get-prop';
import { inject } from 'aurelia-dependency-injection';
import { bindingMode, BindingEngine } from 'aurelia-binding';
import { bindable, customElement } from 'aurelia-templating';
import { logger, EntityManager, Entity, OrmMetadata } from '../aurelia-orm';

export let AssociationSelect = (_dec = customElement('association-select'), _dec2 = inject(BindingEngine, EntityManager, Element), _dec3 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec4 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec(_class = _dec2(_class = (_class2 = class AssociationSelect {
  constructor(bindingEngine, entityManager) {
    _initDefineProp(this, 'criteria', _descriptor, this);

    _initDefineProp(this, 'repository', _descriptor2, this);

    _initDefineProp(this, 'identifier', _descriptor3, this);

    _initDefineProp(this, 'property', _descriptor4, this);

    _initDefineProp(this, 'resource', _descriptor5, this);

    _initDefineProp(this, 'options', _descriptor6, this);

    _initDefineProp(this, 'association', _descriptor7, this);

    _initDefineProp(this, 'manyAssociation', _descriptor8, this);

    _initDefineProp(this, 'value', _descriptor9, this);

    _initDefineProp(this, 'error', _descriptor10, this);

    _initDefineProp(this, 'multiple', _descriptor11, this);

    _initDefineProp(this, 'hidePlaceholder', _descriptor12, this);

    _initDefineProp(this, 'selectablePlaceholder', _descriptor13, this);

    _initDefineProp(this, 'placeholderText', _descriptor14, this);

    this._subscriptions = [];
    this.bindingEngine = bindingEngine;
    this.entityManager = entityManager;
  }

  load(reservedValue) {
    return this.buildFind().then(options => {
      let result = options;

      this.options = Array.isArray(result) ? result : [result];

      this.setValue(reservedValue);
    });
  }

  setValue(value) {
    if (!value) {
      return;
    }

    if (!Array.isArray(value)) {
      this.value = typeof value === 'object' ? getProp(value, this.identifier) : value;

      return;
    }

    let selectedValues = [];

    value.forEach(selected => {
      selectedValues.push(selected instanceof Entity ? selected.getId() : selected);
    });

    this.value = selectedValues;
  }

  getCriteria() {
    if (typeof this.criteria !== 'object') {
      return {};
    }

    return JSON.parse(JSON.stringify(this.criteria || {}));
  }

  buildFind() {
    let repository = this.repository;
    let criteria = this.getCriteria();
    let findPath = repository.getResource();

    criteria.populate = false;

    if (this.manyAssociation) {
      let assoc = this.manyAssociation;

      delete criteria.populate;

      findPath = `${ assoc.getResource() }/${ assoc.getId() }/${ findPath }`;
    } else if (this.association) {
      let associations = Array.isArray(this.association) ? this.association : [this.association];

      associations.forEach(association => {
        criteria[this.propertyForResource(this.ownMeta, association.getResource())] = association.getId();
      });
    }

    return repository.findPath(findPath, criteria).catch(error => {
      this.error = error;

      return error;
    });
  }

  verifyAssociationValues() {
    if (this.manyAssociation) {
      return !!this.manyAssociation.getId();
    }

    if (this.association) {
      let associations = Array.isArray(this.association) ? this.association : [this.association];

      return !associations.some(association => {
        return !association.getId();
      });
    }

    return true;
  }

  observe(association) {
    if (Array.isArray(association)) {
      association.forEach(assoc => this.observe(assoc));

      return this;
    }

    this._subscriptions.push(this.bindingEngine.propertyObserver(association, association.getIdProperty()).subscribe(() => {
      if (this.verifyAssociationValues()) {
        return this.load();
      }

      this.options = undefined;

      return Promise.resolve();
    }));

    return this;
  }

  isChanged(property, newVal, oldVal) {
    return !this[property] || !newVal || newVal === oldVal;
  }

  resourceChanged(resource) {
    if (!resource) {
      logger.error(`resource is ${ typeof resource }. It should be a string or a reference`);
    }

    this.repository = this.entityManager.getRepository(resource);
  }

  criteriaChanged(newVal, oldVal) {
    if (this.isChanged('criteria', newVal, oldVal)) {
      return;
    }

    if (this.value) {
      this.load(this.value);
    }
  }

  attached() {
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
  }

  propertyForResource(meta, resource) {
    let associations = meta.fetch('associations');

    return Object.keys(associations).filter(key => {
      return associations[key].entity === resource;
    })[0];
  }

  unbind() {
    this._subscriptions.forEach(subscription => subscription.dispose());
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'criteria', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'repository', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'identifier', [bindable], {
  enumerable: true,
  initializer: function () {
    return 'id';
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'property', [bindable], {
  enumerable: true,
  initializer: function () {
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
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'error', [_dec4], {
  enumerable: true,
  initializer: null
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'multiple', [bindable], {
  enumerable: true,
  initializer: function () {
    return false;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, 'hidePlaceholder', [bindable], {
  enumerable: true,
  initializer: function () {
    return false;
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, 'selectablePlaceholder', [bindable], {
  enumerable: true,
  initializer: function () {
    return false;
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, 'placeholderText', [bindable], {
  enumerable: true,
  initializer: null
})), _class2)) || _class) || _class);