System.register(['aurelia-validation', 'aurelia-framework', 'spoonx/aurelia-api', 'aurelia-metadata', './association-metadata'], function (_export) {
  'use strict';

  var Validation, transient, inject, Rest, metadata, AssociationMetaData, Entity;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaValidation) {
      Validation = _aureliaValidation.Validation;
    }, function (_aureliaFramework) {
      transient = _aureliaFramework.transient;
      inject = _aureliaFramework.inject;
    }, function (_spoonxAureliaApi) {
      Rest = _spoonxAureliaApi.Rest;
    }, function (_aureliaMetadata) {
      metadata = _aureliaMetadata.metadata;
    }, function (_associationMetadata) {
      AssociationMetaData = _associationMetadata.AssociationMetaData;
    }],
    execute: function () {
      Entity = (function () {
        function Entity(validator, restClient) {
          _classCallCheck(this, _Entity);

          Object.defineProperty(this, 'validator', {
            value: validator,
            writable: false,
            enumerable: false
          });

          Object.defineProperty(this, 'api', {
            value: restClient,
            writable: false,
            enumerable: false
          });
        }

        _createClass(Entity, [{
          key: 'setEntityManager',
          value: function setEntityManager(entityManager) {
            Object.defineProperty(this, 'entityManager', {
              value: entityManager,
              writable: false,
              enumerable: false
            });

            return this;
          }
        }, {
          key: 'save',
          value: function save() {
            if (this.id) {
              return this.update();
            }

            return this.api.create(this.resource, this.asObject(true));
          }
        }, {
          key: 'destroy',
          value: function destroy() {
            if (!this.id) {
              throw new Error('Required value "id" missing on entity.');
            }

            return this.api.destroy(this.resource, this.id);
          }
        }, {
          key: 'setData',
          value: function setData(data) {
            Object.assign(this, data);

            return this;
          }
        }, {
          key: 'setResource',
          value: function setResource(resource) {
            Object.defineProperty(this, 'resource', {
              value: resource,
              writable: false,
              enumerable: false
            });

            return this;
          }
        }, {
          key: 'update',
          value: function update() {
            if (!this.id) {
              throw new Error('Required value "id" missing on entity.');
            }

            return this.api.update(this.resource, this.id, this.asObject(true));
          }
        }, {
          key: 'enableValidation',
          value: function enableValidation() {
            Object.defineProperty(this, 'validation', {
              value: this.validator.on(this),
              writable: false,
              enumerable: false
            });

            return this;
          }
        }, {
          key: 'asObject',
          value: function asObject(shallow) {
            var _this = this;

            var pojo = {};
            var associationsMetadata = metadata.getOwn(AssociationMetaData.key, this);

            Object.keys(this).forEach(function (propertyName) {
              var value = _this[propertyName];

              if (!associationsMetadata || !associationsMetadata.has(propertyName)) {
                return pojo[propertyName] = value;
              }

              if (shallow && typeof value === 'object' && value.id) {
                return pojo[propertyName] = value.id;
              }

              if (Array.isArray(value)) {
                var _ret = (function () {
                  var asObjects = [];

                  value.forEach(function (childValue, index) {
                    if (!(childValue instanceof Entity)) {
                      return asObjects[index] = childValue;
                    }

                    asObjects[index] = childValue.asObject();
                  });

                  return {
                    v: pojo[propertyName] = asObjects
                  };
                })();

                if (typeof _ret === 'object') return _ret.v;
              }

              if (!(value instanceof Entity)) {
                return pojo[propertyName] = value;
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
        }]);

        var _Entity = Entity;
        Entity = inject(Validation, Rest)(Entity) || Entity;
        Entity = transient()(Entity) || Entity;
        return Entity;
      })();

      _export('Entity', Entity);
    }
  };
});