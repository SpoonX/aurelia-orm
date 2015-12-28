import {Rest} from 'spoonx/aurelia-api';
import {EntityManager, Repository, DefaultRepository, Entity} from '../src/index';
import {WithResource} from './resources/entity/with-resource';
import {WithAssociations} from './resources/entity/with-associations';
import {WithCustomRepository} from './resources/entity/with-custom-repository';
import {SimpleCustom} from './resources/repository/simple-custom';
import {Container} from 'aurelia-dependency-injection';
import {Foo} from './resources/entity/foo';
import {Custom} from './resources/entity/custom';

function getRestClient() {
  let container  = new Container();
  let restClient = container.get(Rest);

  restClient.client.configure(builder => {
    builder.useStandardConfiguration().withBaseUrl('http://localhost:1927/');
  });

  return restClient;
}

function constructRepository(repository, resource) {
  var instance = new repository(getRestClient());

  instance.entityManager = getEntityManager();

  if (resource) {
    instance.setResource(resource);
  }

  return instance;
}

function getEntityManager() {
  var entityManager = new EntityManager(new Container());

  return entityManager.registerEntities([WithResource, Foo, Custom, WithCustomRepository, WithAssociations]);
}

describe('Repository', function() {
  describe('.setResource()', function() {
    it('Should set the resource.', function() {
      var repository = new Repository(getRestClient());

      repository.setResource('foo');

      expect(repository.resource).toBe('foo');
    });

    it('Should return self.', function() {
      var repository = new Repository(getRestClient());

      expect(repository.setResource('foo')).toBe(repository);
    });
  });

  describe('.find()', function() {
    it('Should perform a regular findAll. (Default repository)', function(done) {
      var repository = constructRepository(DefaultRepository, 'find-test');

      repository.find().then(response => {
        expect(response.path).toEqual('/find-test');
        expect(response.method).toEqual('GET');
        expect(response instanceof Entity).toBe(true);

        done();
      });
    });

    it('Should perform a find with criteria. (Default repository)', function(done) {
      var repository = constructRepository(DefaultRepository, 'find-test');

      repository.find({foo: 'bar', bar: 'baz', skip: 10}).then(response => {
        expect(response.path).toEqual('/find-test');
        expect(response.method).toEqual('GET');
        expect(response.query).toEqual({foo: 'bar', bar: 'baz', skip: '10'});
        expect(response instanceof Entity).toBe(true);

        done();
      });
    });

    it('Should perform a regular findAll. (Custom repository)', function(done) {
      var repository = constructRepository(SimpleCustom, 'withcustomrepository');

      repository.find().then(response => {
        expect(response.path).toEqual('/withcustomrepository');
        expect(response.method).toEqual('GET');
        expect(response instanceof Entity).toBe(true);

        done();
      }).catch(y => console.log(y.stack));
    });

    it('Should perform a find with criteria. (Custom repository)', function(done) {
      var repository = constructRepository(SimpleCustom, 'withcustomrepository');

      repository.find({foo: 'bar', bar: 'baz', skip: 10}).then(response => {
        expect(response.path).toEqual('/withcustomrepository');
        expect(response.method).toEqual('GET');
        expect(response.query).toEqual({foo: 'bar', bar: 'baz', skip: '10'});
        expect(response instanceof Entity).toBe(true);

        done();
      }).catch(y => console.log(y.stack));
    });

    it('Should use raw', function(done) {
      var repository = constructRepository(DefaultRepository, 'find-test');

      repository.find(null, true).then(response => {
        expect(response.path).toEqual('/find-test');
        expect(response.method).toEqual('GET');
        expect(response instanceof Entity).toBe(false);

        done();
      });
    });
  });

  describe('.count()', function() {
    it('Should make a count call to the api', function(done) {
      var repository = constructRepository(DefaultRepository, 'find-test');

      repository.count().then(response => {
        expect(response.path).toEqual('/find-test/count');
        expect(response.method).toEqual('GET');

        done();
      })
    });

    it('Should make a count call to the api with criteria', function(done) {
      var repository = constructRepository(DefaultRepository, 'find-test');

      repository.count({where: 'something'}).then(response => {
        expect(response.path).toEqual('/find-test/count');
        expect(response.query).toEqual({where: 'something'});
        expect(response.method).toEqual('GET');

        done();
      })
    });
  });

  describe('.populateEntities()', function() {
    it('Should return null if no data was supplied.', function() {
      var repository = constructRepository(DefaultRepository, 'populate--test');

      expect(repository.populateEntities()).toBe(null);
    });

    it('Should return instance if object was supplied.', function() {
      var repository = constructRepository(DefaultRepository, 'populate-test'),
          populated  = repository.populateEntities({});

      expect(populated instanceof Entity).toBe(true);
    });

    it('Should return an array of instances if array was supplied.', function() {
      var repository = constructRepository(DefaultRepository, 'find-test'),
          populated  = repository.populateEntities([{}, {}]);

      expect(Array.isArray(populated)).toBe(true);
      expect(populated[0] instanceof Entity).toBe(true);
      expect(populated[1] instanceof Entity).toBe(true);
    });
  });

  describe('.getPopulatedEntity()', function() {
    it('Should return a populated instance.', function() {
      var repository = constructRepository(DefaultRepository, 'populated-test'),
          populated  = repository.getPopulatedEntity({});

      expect(populated instanceof Entity).toBe(true);
    });

    it('Should mark populated instance as clean.', function() {
      var repository = constructRepository(DefaultRepository, 'populated-test'),
          populated  = repository.getPopulatedEntity({});

      expect(populated instanceof Entity).toBe(true);
      expect(populated.isClean()).toBe(true);
      expect(populated.isDirty()).toBe(false);
    });

    it('Should return a populated instance with associations.', function() {
      var entityManager = getEntityManager(),
          repository    = entityManager.getRepository(WithAssociations),
          populated     = repository.getPopulatedEntity({
            control: 'science!',
            foo: {
              my: 'anaconda',
              don: 't'
            },
            bar: [
              {want: 'none'},
              {unless: 'you got buns hun'}
            ]
          });

      expect(populated.foo instanceof Foo).toBe(true);
      expect(Array.isArray(populated.bar)).toBe(true);
      expect(populated.bar[0] instanceof Custom).toBe(true);
      expect(populated.bar[1] instanceof Custom).toBe(true);
      expect(populated.foo.my).toBe('anaconda');
      expect(populated.bar[0].want).toBe('none');
      expect(populated.bar[1].unless).toBe('you got buns hun');
      expect(populated.control).toBe('science!');
    });
  });

  describe('.getNewEntity()', function() {
    it('Should give me a new entity instance. (Default)', function() {
      var repository = constructRepository(DefaultRepository, 'new-entity-test'),
          newEntity  = repository.getNewEntity();

      expect(newEntity instanceof Entity).toBe(true);
      expect(newEntity.getResource()).toBe('new-entity-test');
    });

    it('Should give me a new entity instance. (Custom)', function() {
      var entityManager = getEntityManager(),
          repository    = entityManager.getRepository(WithResource),
          newEntity     = repository.getNewEntity();

      expect(newEntity instanceof WithResource).toBe(true);
      expect(newEntity.getResource()).toBe('with-resource');
    });
  });

  describe('.getNewPopulatedEntity()', function() {
    it('Should return a new entity, with its children populated.', function() {
      var repository      = constructRepository(DefaultRepository, 'withassociations'),
          populatedEntity = repository.getNewPopulatedEntity();

      expect(populatedEntity instanceof WithAssociations).toBe(true);
      expect(populatedEntity.bar instanceof Custom).toBe(true);
      expect(populatedEntity.foo instanceof Foo).toBe(true);
    });

    it('Should compose empty values with .asObject()', function() {
      var repository      = constructRepository(DefaultRepository, 'withassociations'),
          populatedEntity = repository.getNewPopulatedEntity();

      expect(populatedEntity.asObject()).toEqual({bar: {}, foo: {}});
    });
  });
});
