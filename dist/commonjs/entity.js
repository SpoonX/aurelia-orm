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

    Object.defineProperty(this, '__api', {
      value: restClient,
      writable: false,
      enumerable: false
    });

    Object.defineProperty(this, '__meta', {
      value: _ormMetadata.OrmMetadata.forTarget(this.constructor),
      writable: false,
      enumerable: false
    });

    if (!this.hasValidation()) {
      return this;
    }

    Object.defineProperty(this, '__validator', {
      value: validator,
      writable: false,
      enumerable: false
    });
  }

  _createClass(Entity, [{
    key: 'getMeta',
    value: function getMeta() {
      return this.__meta;
    }
  }, {
    key: 'save',
    value: function save() {
      if (this.id) {
        return this.update();
      }

      return this.__api.create(this.getResource(), this.asObject(true));
    }
  }, {
    key: 'update',
    value: function update() {
      if (!this.id) {
        throw new Error('Required value "id" missing on entity.');
      }

      var requestBody = this.asObject(true);

      delete requestBody.id;

      return this.__api.update(this.getResource(), this.id, requestBody);
    }
  }, {
    key: 'getResource',
    value: function getResource() {
      return this.__resource || this.getMeta().fetch('resource');
    }
  }, {
    key: 'setResource',
    value: function setResource(resource) {
      Object.defineProperty(this, '__resource', {
        value: resource,
        writable: false,
        enumerable: false
      });

      return this;
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

      Object.defineProperty(this, '__validation', {
        value: this.__validator.on(this),
        writable: false,
        enumerable: false
      });

      return this;
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

        if (!metadata.has('associations', propertyName)) {
          pojo[propertyName] = value;

          return;
        }

        if (!value) {
          pojo[propertyName] = value;

          return;
        }

        if (shallow && typeof value === 'object' && value.id) {
          pojo[propertyName] = value.id;

          return;
        }

        if (Array.isArray(value)) {
          var _ret = (function () {
            var asObjects = [];

            value.forEach(function (childValue, index) {
              if (!(childValue instanceof Entity)) {
                asObjects[index] = childValue;

                return;
              }

              asObjects[index] = childValue.asObject();
            });

            pojo[propertyName] = asObjects;

            return {
              v: undefined
            };
          })();

          if (typeof _ret === 'object') return _ret.v;
        }

        if (!(value instanceof Entity)) {
          pojo[propertyName] = value;

          return;
        }

        pojo[propertyName] = value.asObject();
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
  }]);

  var _Entity = Entity;
  Entity = (0, _aureliaFramework.inject)(_aureliaValidation.Validation, _spoonxAureliaApi.Rest)(Entity) || Entity;
  Entity = (0, _aureliaFramework.transient)()(Entity) || Entity;
  return Entity;
})();

exports.Entity = Entity;