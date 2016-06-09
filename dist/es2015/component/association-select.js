var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;

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

import { inject } from 'aurelia-dependency-injection';
import { bindingMode, BindingEngine } from 'aurelia-binding';
import { bindable, customElement } from 'aurelia-templating';
import { EntityManager } from '../entity-manager';
import { Entity } from '../entity';
import { OrmMetadata } from '../orm-metadata';
import extend from 'extend';

export let AssociationSelect = (_dec = customElement('association-select'), _dec2 = inject(BindingEngine, EntityManager, Element), _dec3 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec(_class = _dec2(_class = (_class2 = class AssociationSelect {
  constructor(bindingEngine, entityManager, element) {
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
      this.value = value;

      return;
    }

    let selectedValues = [];

    value.forEach(selected => {
      selectedValues.push(selected instanceof Entity ? selected.id : selected);
    });

    this.value = selectedValues;
  }

  getCriteria() {
    if (typeof this.criteria !== 'object') {
      return {};
    }

    return extend(true, {}, this.criteria);
  }

  buildFind() {
    let repository = this.repository;
    let criteria = this.getCriteria();
    let findPath = repository.getResource();
    criteria.populate = false;

    if (this.manyAssociation) {
      let assoc = this.manyAssociation;

      delete criteria.populate;

      let property = this.propertyForResource(assoc.getMeta(), repository.getResource());
      findPath = `${ assoc.getResource() }/${ assoc.id }/${ property }`;
    } else if (this.association) {
      let associations = Array.isArray(this.association) ? this.association : [this.association];

      associations.forEach(association => {
        criteria[this.propertyForResource(this.ownMeta, association.getResource())] = association.id;
      });
    }

    return repository.findPath(findPath, criteria);
  }

  verifyAssociationValues() {
    if (this.manyAssociation) {
      return !!this.manyAssociation.id;
    }

    if (this.association) {
      let associations = Array.isArray(this.association) ? this.association : [this.association];

      return !associations.some(association => {
        return !association.id;
      });
    }

    return true;
  }

  observe(association) {
    if (Array.isArray(association)) {
      association.forEach(assoc => this.observe(assoc));

      return this;
    }

    this._subscriptions.push(this.bindingEngine.propertyObserver(association, 'id').subscribe(() => {
      if (this.verifyAssociationValues()) {
        return this.load();
      }

      this.options = undefined;
    }));

    return this;
  }

  attached() {
    if (!this.repository && this.element.hasAttribute('resource')) {
      this.repository = this.entityManager.getRepository(this.element.getAttribute('resource'));
    }

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
  initializer: function () {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'repository', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'property', [bindable], {
  enumerable: true,
  initializer: function () {
    return 'name';
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'options', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'association', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'manyAssociation', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'value', [_dec3], {
  enumerable: true,
  initializer: null
})), _class2)) || _class) || _class);