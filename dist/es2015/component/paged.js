var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;

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

import { logger, EntityManager } from '../aurelia-orm';
import { bindingMode } from 'aurelia-binding';
import { bindable, customElement } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { resolvedView } from 'aurelia-view-manager';

export let Paged = (_dec = customElement('paged'), _dec2 = resolvedView('spoonx/orm', 'paged'), _dec3 = inject(EntityManager), _dec4 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec5 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec6 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec7 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = class Paged {

  constructor(entityManager) {
    _initDefineProp(this, 'data', _descriptor, this);

    _initDefineProp(this, 'page', _descriptor2, this);

    _initDefineProp(this, 'error', _descriptor3, this);

    _initDefineProp(this, 'loading', _descriptor4, this);

    _initDefineProp(this, 'criteria', _descriptor5, this);

    _initDefineProp(this, 'repository', _descriptor6, this);

    _initDefineProp(this, 'resource', _descriptor7, this);

    _initDefineProp(this, 'limit', _descriptor8, this);

    this.entityManager = entityManager;
  }

  attached() {
    if (!this.page) {
      this.page = 1;
    }

    if (!this.criteria) {
      this.criteria = {};
    }

    this.reloadData();
  }

  reloadData() {
    this.getData();
  }

  isChanged(property, newVal, oldVal) {
    return !this[property] || !newVal || newVal === oldVal;
  }

  pageChanged(newVal, oldVal) {
    if (this.isChanged('resource', newVal, oldVal) || this.isChanged('criteria', newVal, oldVal)) {
      return;
    }

    this.reloadData();
  }

  resourceChanged(newVal, oldVal) {
    if (this.isChanged('resource', newVal, oldVal)) {
      return;
    }

    this.reloadData();
  }

  criteriaChanged(newVal, oldVal) {
    if (this.isChanged('criteria', newVal, oldVal)) {
      return;
    }

    this.reloadData();
  }

  resourceChanged(resource) {
    if (!resource) {
      logger.error(`resource is ${typeof resource}. It should be a string or a reference`);
    }

    this.repository = this.entityManager.getRepository(resource);
  }

  getData() {
    let criteria = JSON.parse(JSON.stringify(this.criteria));

    criteria.skip = this.page * this.limit - this.limit;
    criteria.limit = this.limit;
    this.error = null;
    this.loading = true;
    console.log("Paged: GetData(): loading = " + this.loading);
    this.repository.find(criteria, true).then(result => {
      this.data = result;
      this.loading = false;
      console.log("Paged: GetData() done: loading = " + this.loading);
    }).catch(error => {
      this.error = error;
      this.loading = false;
      console.log("Paged: GetData() errored: loading = " + this.loading);
    });
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'data', [_dec4], {
  enumerable: true,
  initializer: function () {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'page', [_dec5], {
  enumerable: true,
  initializer: function () {
    return 1;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'error', [_dec6], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_dec7], {
  enumerable: true,
  initializer: function () {
    return false;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'criteria', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'repository', [bindable], {
  enumerable: true,
  initializer: function () {
    return null;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'resource', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'limit', [bindable], {
  enumerable: true,
  initializer: function () {
    return 30;
  }
})), _class2)) || _class) || _class) || _class);