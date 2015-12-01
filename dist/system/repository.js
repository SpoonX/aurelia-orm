System.register(['aurelia-framework', 'spoonx/aurelia-api', 'aurelia-metadata', './association-metadata'], function (_export) {
  'use strict';

  var inject, Rest, metadata, AssociationMetaData, Repository;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_spoonxAureliaApi) {
      Rest = _spoonxAureliaApi.Rest;
    }, function (_aureliaMetadata) {
      metadata = _aureliaMetadata.metadata;
    }, function (_associationMetadata) {
      AssociationMetaData = _associationMetadata.AssociationMetaData;
    }],
    execute: function () {
      Repository = (function () {
        function Repository(restClient) {
          _classCallCheck(this, _Repository);

          this.api = restClient;
        }

        _createClass(Repository, [{
          key: 'setEntity',
          value: function setEntity(entity) {
            this.entity = entity;

            return this;
          }
        }, {
          key: 'setEntityReference',
          value: function setEntityReference(entityReference) {
            this.entityReference = entityReference;

            return this;
          }
        }, {
          key: 'find',
          value: function find(criteria, raw) {
            var _this = this;

            var findQuery = this.api.find(this.entity.resource, criteria);

            if (raw) {
              return findQuery;
            }

            return findQuery.then(function (x) {
              return _this.populateEntities(x);
            });
          }
        }, {
          key: 'count',
          value: function count(criteria) {
            return this.api.find(this.entity.resource + '/count', criteria);
          }
        }, {
          key: 'create',
          value: function create(data) {
            return this.getPopulatedEntity(data);
          }
        }, {
          key: 'populateEntities',
          value: function populateEntities(data) {
            var _this2 = this;

            if (!data) {
              return null;
            }

            if (!Array.isArray(data)) {
              return this.getPopulatedEntity(data);
            }

            var collection = [];

            data.forEach(function (source) {
              collection.push(_this2.getPopulatedEntity(source));
            });

            return collection;
          }
        }, {
          key: 'getPopulatedEntity',
          value: function getPopulatedEntity(data) {
            var entity = this.getNewEntity();
            var associationsMetadata = metadata.getOwn(AssociationMetaData.key, entity);
            var populatedData = {};
            var key = undefined;

            for (key in data) {
              if (!data.hasOwnProperty(key)) {
                continue;
              }

              if (!associationsMetadata || !associationsMetadata.has(key) || typeof data[key] !== 'object') {
                populatedData[key] = data[key];

                continue;
              }

              var reference = associationsMetadata.fetch(key);

              populatedData[key] = this.entityManager.getRepository(reference).populateEntities(data[key]);
            }

            return entity.setData(populatedData);
          }
        }, {
          key: 'getNewEntity',
          value: function getNewEntity() {
            return this.entityManager.getEntity(this.entityReference);
          }
        }]);

        var _Repository = Repository;
        Repository = inject(Rest)(Repository) || Repository;
        return Repository;
      })();

      _export('Repository', Repository);
    }
  };
});