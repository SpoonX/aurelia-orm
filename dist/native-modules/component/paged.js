var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;

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

import { logger } from '../aurelia-orm';
import { bindingMode } from 'aurelia-binding';
import { bindable, customElement } from 'aurelia-templating';

export var Paged = (_dec = customElement('paged'), _dec2 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec3 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec4 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec(_class = (_class2 = function () {
  function Paged() {
    

    _initDefineProp(this, 'data', _descriptor, this);

    _initDefineProp(this, 'page', _descriptor2, this);

    _initDefineProp(this, 'error', _descriptor3, this);

    _initDefineProp(this, 'criteria', _descriptor4, this);

    _initDefineProp(this, 'repository', _descriptor5, this);

    _initDefineProp(this, 'resource', _descriptor6, this);

    _initDefineProp(this, 'limit', _descriptor7, this);
  }

  Paged.prototype.attached = function attached() {
    if (!this.page) {
      this.page = 1;
    }

    if (!this.criteria) {
      this.criteria = {};
    }

    this.reloadData();
  };

  Paged.prototype.reloadData = function reloadData() {
    this.getData();
  };

  Paged.prototype.isChanged = function isChanged(property, newVal, oldVal) {
    return !this[property] || !newVal || newVal === oldVal;
  };

  Paged.prototype.pageChanged = function pageChanged(newVal, oldVal) {
    if (this.isChanged('resource', newVal, oldVal) || this.isChanged('criteria', newVal, oldVal)) {
      return;
    }

    this.reloadData();
  };

  Paged.prototype.resourceChanged = function resourceChanged(newVal, oldVal) {
    if (this.isChanged('resource', newVal, oldVal)) {
      return;
    }

    this.reloadData();
  };

  Paged.prototype.criteriaChanged = function criteriaChanged(newVal, oldVal) {
    if (this.isChanged('criteria', newVal, oldVal)) {
      return;
    }

    this.reloadData();
  };

  Paged.prototype.resourceChanged = function resourceChanged(resource) {
    if (!resource) {
      logger.error('resource is ' + (typeof resource === 'undefined' ? 'undefined' : _typeof(resource)) + '. It should be a string or a reference');
    }

    this.repository = this.entityManager.getRepository(resource);
  };

  Paged.prototype.getData = function getData() {
    var _this = this;

    var criteria = JSON.parse(JSON.stringify(this.criteria));

    criteria.skip = this.page * this.limit - this.limit;
    criteria.limit = this.limit;
    this.error = null;

    this.repository.find(criteria, true).then(function (result) {
      _this.data = result;
    }).catch(function (error) {
      _this.error = error;
    });
  };

  return Paged;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'data', [_dec2], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'page', [_dec3], {
  enumerable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'error', [_dec4], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'criteria', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'repository', [bindable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'resource', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'limit', [bindable], {
  enumerable: true,
  initializer: function initializer() {
    return 30;
  }
})), _class2)) || _class);