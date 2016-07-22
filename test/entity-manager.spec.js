import {EntityManager} from '../src/entity-manager';
import {Container} from 'aurelia-dependency-injection';
import {WithResource} from './resources/entity/with-resource';
import {WithCustomRepository} from './resources/entity/with-custom-repository';
import {SimpleCustom} from './resources/repository/simple-custom';
import {DefaultRepository} from  '../src/default-repository';
import {Entity} from  '../src/entity';

describe('EntityManager', function() {
  describe('.registerEntities()', function() {
    it('Should register entities with the manager', function() {
      let entityManager = new EntityManager(new Container());

      entityManager.registerEntities([WithResource]);

      expect(entityManager.entities).toEqual({'with-resource': WithResource});
    });

    it('Should return self.', function() {
      let entityManager = new EntityManager(new Container());

      expect(entityManager.registerEntities([WithResource])).toBe(entityManager);
    });
  });

  describe('.registerEntity()', function() {
    it('Should return self.', function() {
      let entityManager = new EntityManager(new Container());

      expect(entityManager.registerEntity(WithResource)).toBe(entityManager);
    });

    it('Should register an entity with the manager', function() {
      let entityManager = new EntityManager(new Container());

      entityManager.registerEntity(WithResource);

      expect(entityManager.entities).toEqual({'with-resource': WithResource});
    });
  });

  describe('.getRepository()', function() {
    it('Should return the default repository when no custom specified. (Entity resource)', function() {
      let entityManager = new EntityManager(new Container());

      entityManager.registerEntity(WithResource);
      expect(entityManager.getRepository('with-resource') instanceof DefaultRepository).toBe(true);
    });

    it('Should return the default repository when no custom specified. (Entity reference)', function() {
      let entityManager = new EntityManager(new Container());

      entityManager.registerEntity(WithResource);

      expect(entityManager.getRepository(WithResource) instanceof DefaultRepository).toBe(true);
    });

    it('Should return the custom repository when specified.', function() {
      let entityManager = new EntityManager(new Container());

      entityManager.registerEntity(WithCustomRepository);

      expect(entityManager.getRepository(WithCustomRepository) instanceof SimpleCustom).toBe(true);
    });

    it('Should return the default repository when no custom specified. (bullshit resource)', function() {
      let entityManager = new EntityManager(new Container());

      expect(entityManager.getRepository('does-not-exist') instanceof DefaultRepository).toBe(true);
    });

    it('Should cache the repository if it was composed from the DefaultRepository.', function() {
      let entityManager = new EntityManager(new Container());

      // No cache
      expect(entityManager.repositories['please-cache-this'] instanceof DefaultRepository).toBe(false);

      // Get, and set cache
      expect(entityManager.getRepository('please-cache-this') instanceof DefaultRepository).toBe(true);

      // Verify cache
      expect(entityManager.repositories['please-cache-this'] instanceof DefaultRepository).toBe(true);

      // Verify cache gets used
      expect(entityManager.getRepository('please-cache-this') === entityManager.repositories['please-cache-this']).toBe(true);
    });

    it('Should throw an error when given an object without resource metadata.', function() {
      let entityManager = new EntityManager(new Container());

      expect(function() {
        entityManager.getRepository(function() {});
      }).toThrowError(Error, 'Unable to find resource for entity.');
    });
  });

  describe('.resolveEntityReference()', function() {
    it('Should resolve to the correct entityReference. (Custom Entity reference)', function() {
      let entityManager = new EntityManager(new Container());

      entityManager.registerEntity(WithResource);

      expect(entityManager.resolveEntityReference(WithResource) === WithResource).toBe(true);
    });

    it('Should resolve to the correct entityReference. (Custom Entity resource)', function() {
      let entityManager = new EntityManager(new Container());

      entityManager.registerEntity(WithResource);

      expect(entityManager.resolveEntityReference('with-resource') === WithResource).toBe(true);
    });

    it('Should resolve to the correct entityReference. (Entity reference)', function() {
      let entityManager = new EntityManager(new Container());

      expect(entityManager.resolveEntityReference(Entity) === Entity).toBe(true);
    });

    it('Should resolve to the correct entityReference. (Entity resource)', function() {
      let entityManager = new EntityManager(new Container());

      expect(entityManager.resolveEntityReference('foo') === Entity).toBe(true);
    });

    it('Should throw an error on invalid input type.', function() {
      let entityManager = new EntityManager(new Container());

      expect(function() {
        entityManager.resolveEntityReference({});
      }).toThrowError(Error, 'Unable to resolve to entity reference. Expected string or function.');
    });
  });

  describe('.getEntity()', function() {
    it('Should return a new `WithResource` instance (Entity reference).', function() {
      let entityManager = new EntityManager(new Container());

      expect(entityManager.getEntity(WithResource) instanceof WithResource).toBe(true);
    });

    it('Should return a new `WithResource` instance (Entity resource).', function() {
      let entityManager = new EntityManager(new Container());

      entityManager.registerEntity(WithResource);

      expect(entityManager.getEntity('with-resource') instanceof WithResource).toBe(true);
    });

    it('Should return a new `Entity` instance.', function() {
      let entityManager = new EntityManager(new Container());

      expect(entityManager.getEntity('cake') instanceof Entity).toBe(true);
    });

    it('Should throw an error for entity without a resource.', function() {
      let entityManager = new EntityManager(new Container());

      expect(function() {
        entityManager.getEntity(Entity);
      }).toThrowError(Error, 'Unable to find resource for entity.');
    });
  });
});
