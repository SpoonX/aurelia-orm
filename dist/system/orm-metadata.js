System.register(['aurelia-metadata', './default-repository'], function (_export) {
  'use strict';

  var metadata, DefaultRepository, OrmMetadata, Metadata;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaMetadata) {
      metadata = _aureliaMetadata.metadata;
    }, function (_defaultRepository) {
      DefaultRepository = _defaultRepository.DefaultRepository;
    }],
    execute: function () {
      OrmMetadata = (function () {
        function OrmMetadata() {
          _classCallCheck(this, OrmMetadata);
        }

        _createClass(OrmMetadata, null, [{
          key: 'forTarget',
          value: function forTarget(target) {
            return metadata.getOrCreateOwn(Metadata.key, Metadata, target);
          }
        }]);

        return OrmMetadata;
      })();

      _export('OrmMetadata', OrmMetadata);

      Metadata = (function () {
        _createClass(Metadata, null, [{
          key: 'key',
          value: 'spoonx:orm:metadata',
          enumerable: true
        }]);

        function Metadata() {
          _classCallCheck(this, Metadata);

          this.metadata = {
            repository: DefaultRepository,
            resource: null,
            endpoint: null,
            name: null,
            associations: {}
          };
        }

        _createClass(Metadata, [{
          key: 'addTo',
          value: function addTo(key, value) {
            if (typeof this.metadata[key] === 'undefined') {
              this.metadata[key] = [];
            } else if (!Array.isArray(this.metadata[key])) {
              this.metadata[key] = [this.metadata[key]];
            }

            this.metadata[key].push(value);

            return this;
          }
        }, {
          key: 'put',
          value: function put(key, valueOrNestedKey, valueOrNull) {
            if (!valueOrNull) {
              this.metadata[key] = valueOrNestedKey;

              return this;
            }

            if (typeof this.metadata[key] !== 'object') {
              this.metadata[key] = {};
            }

            this.metadata[key][valueOrNestedKey] = valueOrNull;

            return this;
          }
        }, {
          key: 'has',
          value: function has(key, nested) {
            if (typeof nested === 'undefined') {
              return typeof this.metadata[key] !== 'undefined';
            }

            return typeof this.metadata[key] !== 'undefined' && typeof this.metadata[key][nested] !== 'undefined';
          }
        }, {
          key: 'fetch',
          value: function fetch(key, nested) {
            if (!nested) {
              return this.has(key) ? this.metadata[key] : null;
            }

            if (!this.has(key, nested)) {
              return null;
            }

            return this.metadata[key][nested];
          }
        }]);

        return Metadata;
      })();

      _export('Metadata', Metadata);
    }
  };
});