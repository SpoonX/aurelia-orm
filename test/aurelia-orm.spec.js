import {
  configure,
  DefaultRepository,
  Repository,
  Entity,
  OrmMetadata,
  EntityManager,
  association,
  resource,
  endpoint,
  name,
  repository,
  validation,
  type,
  validatedResource
} from '../src/aurelia-orm';
import {Container} from 'aurelia-dependency-injection';

describe('aurelia-orm', function() {
  describe('export', function() {
    it('Should export configure', function() {
      expect(configure).toBeDefined();
    });

    it('Should export DefaultRepository', function() {
      expect(DefaultRepository).toBeDefined();
    });

    it('Should export Repository', function() {
      expect(Repository).toBeDefined();
    });

    it('Should export Entity', function() {
      expect(Entity).toBeDefined();
    });

    it('Should export OrmMetadata', function() {
      expect(OrmMetadata).toBeDefined();
    });

    it('Should export association', function() {
      expect(association).toBeDefined();
    });

    it('Should export resource', function() {
      expect(resource).toBeDefined();
    });

    it('Should export endpoint', function() {
      expect(endpoint).toBeDefined();
    });

    it('Should export name', function() {
      expect(name).toBeDefined();
    });

    it('Should export repository', function() {
      expect(repository).toBeDefined();
    });

    it('Should export validation', function() {
      expect(validation).toBeDefined();
    });

    it('Should export type', function() {
      expect(type).toBeDefined();
    });

    it('Should export validatedResource', function() {
      expect(validatedResource).toBeDefined();
    });
  });

  it('Should export a configure method which returns the entityManager', function() {
    expect(typeof configure).toEqual('function');

    configure({container: new Container(), globalResources: function() {}}, function(entityManager) {
      expect(entityManager instanceof EntityManager).toBe(true);
    });
  });
});
