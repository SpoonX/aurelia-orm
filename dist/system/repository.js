System.register(['aurelia-dependency-injection', 'aurelia-framework', 'spoonx/aurelia-api'], function (_export) {
  'use strict';

  var Container, inject, Rest, Repository;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_spoonxAureliaApi) {
      Rest = _spoonxAureliaApi.Rest;
    }],
    execute: function () {
      Repository = (function () {
        function Repository(restClient, container) {
          _classCallCheck(this, _Repository);

          this.api = restClient;
          this.container = container;
        }

        _createClass(Repository, [{
          key: 'setEntity',
          value: function setEntity(entity) {
            this.entity = entity;

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
            this.getPopulatedEntity(data);
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

            data.forEach(function (entity) {
              collection.push(_this2.getPopulatedEntity(entity));
            });

            return collection;
          }
        }, {
          key: 'getPopulatedEntity',
          value: function getPopulatedEntity(data) {
            return this.getNewEntity().setData(data);
          }
        }, {
          key: 'getNewEntity',
          value: function getNewEntity() {
            return this.container.get(this.entity);
          }
        }]);

        var _Repository = Repository;
        Repository = inject(Rest, Container)(Repository) || Repository;
        return Repository;
      })();

      _export('Repository', Repository);
    }
  };
});