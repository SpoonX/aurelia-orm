'use strict';

System.register(['aurelia-metadata', './default-repository'], function (_export, _context) {
  var metadata, DefaultRepository, _typeof, _class, _temp, OrmMetadata, Metadata;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaMetadata) {
      metadata = _aureliaMetadata.metadata;
    }, function (_defaultRepository) {
      DefaultRepository = _defaultRepository.DefaultRepository;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
      };

      _export('OrmMetadata', OrmMetadata = function () {
        function OrmMetadata() {
          _classCallCheck(this, OrmMetadata);
        }

        OrmMetadata.forTarget = function forTarget(target) {
          return metadata.getOrCreateOwn(Metadata.key, Metadata, target);
        };

        return OrmMetadata;
      }());

      _export('OrmMetadata', OrmMetadata);

      _export('Metadata', Metadata = (_temp = _class = function () {
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

        Metadata.prototype.addTo = function addTo(key, value) {
          if (typeof this.metadata[key] === 'undefined') {
            this.metadata[key] = [];
          } else if (!Array.isArray(this.metadata[key])) {
            this.metadata[key] = [this.metadata[key]];
          }

          this.metadata[key].push(value);

          return this;
        };

        Metadata.prototype.put = function put(key, valueOrNestedKey, valueOrNull) {
          if (!valueOrNull) {
            this.metadata[key] = valueOrNestedKey;

            return this;
          }

          if (_typeof(this.metadata[key]) !== 'object') {
            this.metadata[key] = {};
          }

          this.metadata[key][valueOrNestedKey] = valueOrNull;

          return this;
        };

        Metadata.prototype.has = function has(key, nested) {
          if (typeof nested === 'undefined') {
            return typeof this.metadata[key] !== 'undefined';
          }

          return typeof this.metadata[key] !== 'undefined' && typeof this.metadata[key][nested] !== 'undefined';
        };

        Metadata.prototype.fetch = function fetch(key, nested) {
          if (!nested) {
            return this.has(key) ? this.metadata[key] : null;
          }

          if (!this.has(key, nested)) {
            return null;
          }

          return this.metadata[key][nested];
        };

        return Metadata;
      }(), _class.key = 'spoonx:orm:metadata', _temp));

      _export('Metadata', Metadata);
    }
  };
});