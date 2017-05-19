import {Metadata, OrmMetadata} from '../src/orm-metadata';
import {DefaultRepository} from '../src/default-repository';

describe('OrmMetadata', function() {
  describe('.forTarget()', function() {
    it('Should always return a Metadata instance', function() {
      let meta = OrmMetadata.forTarget({});

      expect(meta instanceof Metadata).toBe(true);
      expect(meta.metadata).toEqual({
        repository: DefaultRepository,
        identifier: null,
        resource: null,
        endpoint: null,
        name: null,
        idProperty: 'id',
        associations: {}
      });
    });

    it('Should return the same instance if already defined', function() {
      let target = {};
      let meta   = OrmMetadata.forTarget(target);

      expect(meta instanceof Metadata).toBe(true);
      expect(meta.metadata).toEqual({
        repository: DefaultRepository,
        identifier: null,
        resource: null,
        name: null,
        endpoint: null,
        idProperty: 'id',
        associations: {}
      });

      let metaElsewhere = OrmMetadata.forTarget(target);

      expect(metaElsewhere).toBe(meta);
    });
  });
});

describe('Metadata', function() {
  describe('.addTo()', function() {
    it('Should create an array if no value exists.', function() {
      let meta = new Metadata();

      meta.addTo('foo', 'bar');

      expect(meta.fetch('foo')).toEqual(['bar']);
    });

    it('Should create an array with the current value in it, if value exists.', function() {
      let meta = new Metadata();

      meta.put('foo', 'bacon');
      meta.addTo('foo', 'bar');

      expect(meta.fetch('foo')).toEqual(['bacon', 'bar']);
    });

    it('Should append to an array.', function() {
      let meta = new Metadata();

      meta.put('foo', ['actual', 'array']);
      meta.addTo('foo', 'bar');

      expect(meta.fetch('foo')).toEqual(['actual', 'array', 'bar']);
    });

    it('Should return self.', function() {
      let meta = new Metadata();

      meta.addTo('foo', 'bar');

      expect(meta.addTo('foo', 'bar')).toEqual(meta);
    });
  });

  describe('.put()', function() {
    it('Should put a value.', function() {
      let meta = new Metadata();

      meta.put('foo', 'bar');

      expect(meta.fetch('foo')).toEqual('bar');
    });

    it('Should put a value nested.', function() {
      let meta = new Metadata();

      meta.put('foo', {});
      meta.put('foo', 'bar', 'bat');

      expect(meta.fetch('foo', 'bar')).toEqual('bat');
    });

    it('Should create an object whet you put a value nested that does not exist yet.', function() {
      let meta = new Metadata();

      meta.put('foo', 'bar', 'bat');

      expect(meta.fetch('foo', 'bar')).toEqual('bat');
    });

    it('Should return self.', function() {
      let meta = new Metadata();

      expect(meta.put('foo', 'bar')).toEqual(meta);
    });
  });

  describe('.has()', function() {
    it('Should return true if metadata has value for key.', function() {
      let meta = new Metadata();

      meta.put('foo', 'bar');

      expect(meta.has('foo')).toEqual(true);
    });

    it('Should return false if metadata does not have value for key.', function() {
      let meta = new Metadata();

      expect(meta.has('foo')).toEqual(false);
    });

    it('Should return true if metadata has nested value for key.', function() {
      let meta = new Metadata();

      meta.put('foo', 'bar', 'bat');

      expect(meta.has('foo', 'bar')).toEqual(true);
    });

    it('Should return false if metadata does not have nested value for keys.', function() {
      let meta = new Metadata();

      expect(meta.has('foo', 'bar')).toEqual(false);
    });
  });

  describe('.fetch()', function() {
    it('Should return the value when exists', function() {
      let meta = new Metadata();

      meta.put('foo', 'bar');

      expect(meta.fetch('foo')).toEqual('bar');
    });

    it('Should return null when value not exists', function() {
      let meta = new Metadata();

      expect(meta.fetch('foo')).toEqual(null);
    });

    it('Should return the nested value when exists', function() {
      let meta = new Metadata();

      meta.put('foo', 'bar', 'bat');

      expect(meta.fetch('foo', 'bar')).toEqual('bat');
    });

    it('Should return null when the nested value not exists', function() {
      let meta = new Metadata();

      expect(meta.fetch('foo', 'bar')).toEqual(null);
    });
  });
});
