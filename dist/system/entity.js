System.register(['aurelia-validation', 'aurelia-framework', './orm-metadata'], function (_export) {
  'use strict';

  var Validation, transient, inject, OrmMetadata, Entity;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _asObject(entity, shallow) {
    var pojo = {};
    var metadata = entity.getMeta();

    Object.keys(entity).forEach(function (propertyName) {
      var value = entity[propertyName];

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
        if (typeof childValue !== 'object') {
          return;
        }

        if (!(childValue instanceof Entity)) {
          asObjects.push(childValue);

          return;
        }

        if (!shallow || typeof childValue === 'object' && !childValue.id) {
          asObjects.push(childValue.asObject(shallow));
        }
      });

      if (asObjects.length > 0) {
        pojo[propertyName] = asObjects;
      }
    });

    return pojo;
  }

  function _asJson(entity, shallow) {
    var json = undefined;

    try {
      json = JSON.stringify(_asObject(entity, shallow));
    } catch (error) {
      json = '';
    }

    return json;
  }

  function getCollectionsCompact(forEntity) {
    var associations = forEntity.getMeta().fetch('associations');
    var collections = {};

    Object.getOwnPropertyNames(associations).forEach(function (index) {
      var association = associations[index];

      if (association.type !== 'collection') {
        return;
      }

      collections[index] = [];

      if (!Array.isArray(forEntity[index])) {
        return;
      }

      forEntity[index].forEach(function (entity) {
        if (typeof entity === 'number') {
          collections[index].push(entity);

          return;
        }

        if (entity.id) {
          collections[index].push(entity.id);
        }
      });
    });

    return collections;
  }

  function getFlat(entity, json) {
    var flat = {
      entity: _asObject(entity, true),
      collections: getCollectionsCompact(entity)
    };

    if (json) {
      flat = JSON.stringify(flat);
    }

    return flat;
  }

  function getPropertyForAssociation(forEntity, entity) {
    var associations = forEntity.getMeta().fetch('associations');

    return Object.keys(associations).filter(function (key) {
      return associations[key].entity === entity.getResource();
    })[0];
  }
  return {
    setters: [function (_aureliaValidation) {
      Validation = _aureliaValidation.Validation;
    }, function (_aureliaFramework) {
      transient = _aureliaFramework.transient;
      inject = _aureliaFramework.inject;
    }, function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }],
    execute: function () {
      Entity = (function () {
        function Entity(validator) {
          _classCallCheck(this, _Entity);

          this.define('__meta', OrmMetadata.forTarget(this.constructor)).define('__cleanValues', {}, true);

          if (!this.hasValidation()) {
            return this;
          }

          return this.define('__validator', validator);
        }

        _createClass(Entity, [{
          key: 'getTransport',
          value: function getTransport() {
            return this.getRepository().getTransport();
          }
        }, {
          key: 'getRepository',
          value: function getRepository() {
            return this.__repository;
          }
        }, {
          key: 'setRepository',
          value: function setRepository(repository) {
            return this.define('__repository', repository);
          }
        }, {
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
            var _this = this;

            if (!this.isNew()) {
              return this.update();
            }

            var response = undefined;
            return this.getTransport().create(this.getResource(), this.asObject(true)).then(function (created) {
              _this.id = created.id;
              response = created;
            }).then(function () {
              return _this.saveCollections();
            }).then(function () {
              return _this.markClean();
            }).then(function () {
              return response;
            });
          }
        }, {
          key: 'update',
          value: function update() {
            var _this2 = this;

            if (this.isNew()) {
              throw new Error('Required value "id" missing on entity.');
            }

            if (this.isClean()) {
              return Promise.resolve(null);
            }

            var requestBody = this.asObject(true);
            var response = undefined;

            delete requestBody.id;

            return this.getTransport().update(this.getResource(), this.id, requestBody).then(function (updated) {
              return response = updated;
            }).then(function () {
              return _this2.saveCollections();
            }).then(function () {
              return _this2.markClean();
            }).then(function () {
              return response;
            });
          }
        }, {
          key: 'addCollectionAssociation',
          value: function addCollectionAssociation(entity, property) {
            property = property || getPropertyForAssociation(this, entity);
            var idToAdd = entity;

            if (entity instanceof Entity) {
              if (!entity.id) {
                return Promise.resolve(null);
              }

              idToAdd = entity.id;
            }

            return this.getTransport().create([this.getResource(), this.id, property, idToAdd].join('/'));
          }
        }, {
          key: 'removeCollectionAssociation',
          value: function removeCollectionAssociation(entity, property) {
            property = property || getPropertyForAssociation(this, entity);
            var idToRemove = entity;

            if (entity instanceof Entity) {
              if (!entity.id) {
                return Promise.resolve(null);
              }

              idToRemove = entity.id;
            }

            return this.getTransport().destroy([this.getResource(), this.id, property, idToRemove].join('/'));
          }
        }, {
          key: 'saveCollections',
          value: function saveCollections() {
            var _this3 = this;

            var tasks = [];
            var currentCollections = getCollectionsCompact(this);
            var cleanCollections = this.__cleanValues.data ? this.__cleanValues.data.collections : null;

            var addTasksForDifferences = function addTasksForDifferences(base, candidate, method) {
              if (base === null) {
                return;
              }

              Object.getOwnPropertyNames(base).forEach(function (property) {
                base[property].forEach(function (id) {
                  if (candidate === null || !Array.isArray(candidate[property]) || candidate[property].indexOf(id) === -1) {
                    tasks.push(method.call(_this3, id, property));
                  }
                });
              });
            };

            addTasksForDifferences(currentCollections, cleanCollections, this.addCollectionAssociation);

            addTasksForDifferences(cleanCollections, currentCollections, this.removeCollectionAssociation);

            return Promise.all(tasks).then(function (results) {
              if (!Array.isArray(results)) {
                return _this3;
              }

              var newState = null;

              while (newState === null) {
                newState = results.pop();
              }

              if (newState) {
                _this3.getRepository().getPopulatedEntity(newState, _this3);
              }

              return _this3;
            });
          }
        }, {
          key: 'markClean',
          value: function markClean() {
            var cleanValues = getFlat(this);
            this.__cleanValues = {
              checksum: JSON.stringify(cleanValues),
              data: cleanValues
            };

            return this;
          }
        }, {
          key: 'isClean',
          value: function isClean() {
            return getFlat(this, true) === this.__cleanValues.checksum;
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

            return this.getTransport().destroy(this.getResource(), this.id);
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
            return !!this.getMeta().fetch('validation');
          }
        }, {
          key: 'asObject',
          value: function asObject(shallow) {
            return _asObject(this, shallow);
          }
        }, {
          key: 'asJson',
          value: function asJson(shallow) {
            return _asJson(this, shallow);
          }
        }], [{
          key: 'getResource',
          value: function getResource() {
            return OrmMetadata.forTarget(this).fetch('resource');
          }
        }, {
          key: 'getName',
          value: function getName() {
            var metaName = OrmMetadata.forTarget(this).fetch('name');

            if (metaName) {
              return metaName;
            }

            return this.getResource();
          }
        }]);

        var _Entity = Entity;
        Entity = inject(Validation)(Entity) || Entity;
        Entity = transient()(Entity) || Entity;
        return Entity;
      })();

      _export('Entity', Entity);
    }
  };
});