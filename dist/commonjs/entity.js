'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaValidation = require('aurelia-validation');

var _aureliaFramework = require('aurelia-framework');

var _spoonxAureliaApi = require('spoonx/aurelia-api');

var _ormMetadata = require('./orm-metadata');

var Entity = (function () {
  function Entity(validator, restClient) {
    _classCallCheck(this, _Entity);

    this.define('__api', restClient).define('__meta', _ormMetadata.OrmMetadata.forTarget(this.constructor)).define('__cleanValues', null, true);

    if (!this.hasValidation()) {
      return this;
    }

    return this.define('__validator', validator);
  }

  _createClass(Entity, [{
    key: 'define',
    value: function define(property, value, writable) {
      Object.defineProperty(this, property, {
        value: value,
        writable: !!writable,
        enumerable: false
      });

      return this;
    }
  }, {
    key: 'getMeta',
    value: function getMeta() {
      return this.__meta;
    }
  }, {
    key: 'save',
    value: function save() {
      if (!this.isNew()) {
        return this.update();
      }

      return this.__api.create(this.getResource(), this.asObject(true));
    }
  }, {
    key: 'update',
    value: function update() {
      if (this.isNew()) {
        throw new Error('Required value "id" missing on entity.');
      }

      if (this.isClean()) {
        return Promise.resolve(null);
      }

      var requestBody = this.asObject(true);

      delete requestBody.id;

      return this.__api.update(this.getResource(), this.id, requestBody);
    }
  }, {
    key: 'markClean',
    value: function markClean() {
      this.__cleanValues = this.asJson(true);

      return this;
    }
  }, {
    key: 'isClean',
    value: function isClean() {
      return this.__cleanValues === this.asJson(true);
    }
  }, {
    key: 'isDirty',
    value: function isDirty() {
      return !this.isClean();
    }
  }, {
    key: 'isNew',
    value: function isNew() {
      return typeof this.id === 'undefined';
    }
  }, {
    key: 'getResource',
    value: function getResource() {
      return this.__resource || this.getMeta().fetch('resource');
    }
  }, {
    key: 'setResource',
    value: function setResource(resource) {
      return this.define('__resource', resource);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (!this.id) {
        throw new Error('Required value "id" missing on entity.');
      }

      return this.__api.destroy(this.getResource(), this.id);
    }
  }, {
    key: 'getName',
    value: function getName() {
      var metaName = this.getMeta().fetch('name');

      if (metaName) {
        return metaName;
      }

      return this.getResource();
    }
  }, {
    key: 'setData',
    value: function setData(data) {
      Object.assign(this, data);

      return this;
    }
  }, {
    key: 'enableValidation',
    value: function enableValidation() {
      if (!this.hasValidation()) {
        throw new Error('Entity not marked as validated. Did you forget the @validation() decorator?');
      }

      if (this.__validation) {
        return this;
      }

      return this.define('__validation', this.__validator.on(this));
    }
  }, {
    key: 'getValidation',
    value: function getValidation() {
      if (!this.hasValidation()) {
        return null;
      }

      if (!this.__validation) {
        this.enableValidation();
      }

      return this.__validation;
    }
  }, {
    key: 'hasValidation',
    value: function hasValidation() {
      return !!this.__meta.fetch('validation');
    }
  }, {
    key: 'asObject',
    value: function asObject(shallow) {
      var _this = this;

      var pojo = {};
      var metadata = this.getMeta();

      Object.keys(this).forEach(function (propertyName) {
        var value = _this[propertyName];

        if (!metadata.has('associations', propertyName) || !value) {
          pojo[propertyName] = value;

          return;
        }

        if (shallow && typeof value === 'object' && value.id) {
          pojo[propertyName] = value.id;

          return;
        }

        if (!Array.isArray(value)) {
          pojo[propertyName] = !(value instanceof Entity) ? value : value.asObject(shallow);

          return;
        }

        var asObjects = [];

        value.forEach(function (childValue) {
          if (!(childValue instanceof Entity)) {
            asObjects.push(childValue);

            return;
          }

          if (!shallow || !childValue.id) {
            asObjects.push(childValue.asObject(shallow));
          }
        });

        if (asObjects.length > 0) {
          pojo[propertyName] = asObjects;
        }
      });

      return pojo;
    }
  }, {
    key: 'asJson',
    value: function asJson(shallow) {
      var json = undefined;

      try {
        json = JSON.stringify(this.asObject(shallow));
      } catch (error) {
        json = '';
      }

      return json;
    }
  }], [{
    key: 'getResource',
    value: function getResource() {
      return _ormMetadata.OrmMetadata.forTarget(this).fetch('resource');
    }
  }, {
    key: 'getName',
    value: function getName() {
      var metaName = _ormMetadata.OrmMetadata.forTarget(this).fetch('name');

      if (metaName) {
        return metaName;
      }

      return this.getResource();
    }
  }]);

  var _Entity = Entity;
  Entity = (0, _aureliaFramework.inject)(_aureliaValidation.Validation, _spoonxAureliaApi.Rest)(Entity) || Entity;
  Entity = (0, _aureliaFramework.transient)()(Entity) || Entity;
  return Entity;
})();

exports.Entity = Entity;