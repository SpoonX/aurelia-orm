import {EntityManager} from '../src/entity-manager';
import {Repository} from '../src/repository';
import {Entity} from '../src/entity';
import {WithResource} from './resources/entity/with-resource';
import {WithAssociations} from './resources/entity/with-associations';
import {WithCustomRepository} from './resources/entity/with-custom-repository';
import {Container} from 'aurelia-dependency-injection';
import {Foo} from './resources/entity/foo';
import {WithType} from './resources/entity/with-type';
import {Custom} from './resources/entity/custom';
import {OrmMetadata} from '../src/orm-metadata';
import {Config} from 'aurelia-api';

function getContainer() {
  let container = new Container();
  let config    = container.get(Config);

  config
    .registerEndpoint('sx/default', 'http://localhost:1927/')
    .setDefaultEndpoint('sx/default');

  return container;
}

function getApiConfig(container) {
  container = container || getContainer();

  return container.get(Config);
}

function constructRepository(repository) {
  let container = getContainer();

  return getEntityManager(container).getRepository(repository);
}

function getEntityManager(container) {
  container         = container || getContainer();
  let entityManager = new EntityManager(container);

  return entityManager.registerEntities([WithResource, Foo, Custom, WithCustomRepository, WithAssociations, WithType]);
}

describe('Repository', function() {
  describe('.getTransport()', function() {
    it('Should get default endpoint.', function() {
      let repository = new Repository(getApiConfig());
      repository.meta = OrmMetadata.forTarget({});

      expect(repository.getTransport().endpoint).toBe('sx/default');
    });

    it('Should get named endpoint.', function() {
      let repository = new Repository(getApiConfig());
      repository.meta = OrmMetadata.forTarget({});
      repository.meta.put('endpoint', 'sx/default');

      expect(repository.getTransport().endpoint).toBe('sx/default');
    });

    it('Should throw for unknown endpoint.', function() {
      let repository = new Repository(getApiConfig());
      repository.meta = OrmMetadata.forTarget({});
      repository.meta.put('endpoint', 'some');

      let getTransportWithTypo = () => repository.getTransport();

      expect(getTransportWithTypo).toThrow();
    });

    it('Should not re-use transport', function() {
      let repository = new Repository(getApiConfig());
      repository.transport = 'a previously created transport';

      expect(repository.getTransport()).toBe('a previously created transport');
    });
  });

  describe('.setResource()', function() {
    it('Should set the resource.', function() {
      let repository = new Repository(getApiConfig());

      repository.setResource('foo');

      expect(repository.resource).toBe('foo');
    });

    it('Should return self.', function() {
      let repository = new Repository(getApiConfig());

      expect(repository.setResource('foo')).toBe(repository);
    });
  });

  describe('.find()', function() {
    it('Should perform a regular findAll. (Default repository)', function(done) {
      let repository = constructRepository('find-test');

      repository.find().then(response => {
        expect(response.path).toEqual('/find-test');
        expect(response.method).toEqual('GET');
        expect(response instanceof Entity).toBe(true);
        expect(response.isClean()).toBe(true);
        expect(response.isDirty()).toBe(false);

        done();
      });
    });

    it('Should perform a find with criteria. (Default repository)', function(done) {
      let repository = constructRepository('find-test');

      repository.find({foo: 'bar', bar: 'baz', skip: 10}).then(response => {
        expect(response.path).toEqual('/find-test');
        expect(response.method).toEqual('GET');
        expect(response.query).toEqual({foo: 'bar', bar: 'baz', skip: '10'});
        expect(response instanceof Entity).toBe(true);
        expect(response.isClean()).toBe(true);
        expect(response.isDirty()).toBe(false);

        done();
      });
    });

    it('Should perform a regular findAll. (Custom repository)', function(done) {
      let repository = constructRepository('withcustomrepository');

      repository.find().then(response => {
        expect(response.path).toEqual('/withcustomrepository');
        expect(response.method).toEqual('GET');
        expect(response instanceof Entity).toBe(true);
        expect(response.isClean()).toBe(true);
        expect(response.isDirty()).toBe(false);

        done();
      });
    });

    it('Should perform a find with criteria. (Custom repository)', function(done) {
      let repository = constructRepository('withcustomrepository');

      repository.find({foo: 'bar', bar: 'baz', skip: 10}).then(response => {
        expect(response.path).toEqual('/withcustomrepository');
        expect(response.method).toEqual('GET');
        expect(response.query).toEqual({foo: 'bar', bar: 'baz', skip: '10'});
        expect(response instanceof Entity).toBe(true);
        expect(response.isClean()).toBe(true);
        expect(response.isDirty()).toBe(false);

        done();
      });
    });

    it('Should use raw', function(done) {
      let repository = constructRepository('find-test');

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
      let repository = constructRepository('find-test');

      repository.count().then(response => {
        expect(response.path).toEqual('/find-test/count');
        expect(response.method).toEqual('GET');

        done();
      });
    });

    it('Should make a count call to the api with criteria', function(done) {
      let repository = constructRepository('find-test');

      repository.count({where: 'something'}).then(response => {
        expect(response.path).toEqual('/find-test/count');
        expect(response.query).toEqual({where: 'something'});
        expect(response.method).toEqual('GET');

        done();
      });
    });
  });

  describe('.populateEntities()', function() {
    it('Should return null if no data was supplied.', function() {
      let repository = constructRepository('populate--test');

      expect(repository.populateEntities()).toBe(null);
    });

    it('Should return instance if object was supplied.', function() {
      let repository = constructRepository('populate-test');
      let populated  = repository.populateEntities({});

      expect(populated instanceof Entity).toBe(true);
    });

    it('Should return an array of instances if array was supplied.', function() {
      let repository = constructRepository('find-test');
      let populated  = repository.populateEntities([{}, {}]);

      expect(Array.isArray(populated)).toBe(true);
      expect(populated[0] instanceof Entity).toBe(true);
      expect(populated[1] instanceof Entity).toBe(true);
    });
  });

  describe('.getPopulatedEntity()', function() {
    it('Should return a populated instance.', function() {
      let repository = constructRepository('populated-test');
      let populated  = repository.getPopulatedEntity({});

      expect(populated instanceof Entity).toBe(true);
    });

    it('Should mark populated instance as clean.', function() {
      let repository = constructRepository('populated-test');
      let populated  = repository.getPopulatedEntity({}).markClean();

      expect(populated instanceof Entity).toBe(true);
      expect(populated.isClean()).toBe(true);
      expect(populated.isDirty()).toBe(false);
    });

    it('Should properly cast values when defined in the entity', function() {
      let repository = constructRepository('with-type');
      let populated  = repository.getPopulatedEntity({
        created: '2016-02-22T18:00:00.000Z',
        disabled: '0',
        age: '24',
        titanic: '500'
      });

      expect(populated instanceof Entity).toBe(true);
      expect(populated.created).toEqual(new Date('2016-02-22T18:00:00.000Z'));
      expect(populated.asObject()).toEqual({
        created: new Date('2016-02-22T18:00:00.000Z'),
        disabled: false,
        age: 24,
        titanic: 500.00
      });
    });

    it('Should return a populated instance with associations.', function() {
      let entityManager = getEntityManager();
      let repository    = entityManager.getRepository(WithAssociations);
      let populated     = repository.getPopulatedEntity({
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
      let repository = constructRepository('new-entity-test');
      let newEntity  = repository.getNewEntity();

      expect(newEntity instanceof Entity).toBe(true);
      expect(newEntity.getResource()).toBe('new-entity-test');
    });

    it('Should give me a new entity instance. (Custom)', function() {
      let entityManager = getEntityManager();
      let repository    = entityManager.getRepository(WithResource);
      let newEntity     = repository.getNewEntity();

      expect(newEntity instanceof WithResource).toBe(true);
      expect(newEntity.getResource()).toBe('with-resource');
    });
  });

  describe('.getNewPopulatedEntity()', function() {
    it('Should return a new entity, with its children populated.', function() {
      let repository      = constructRepository('withassociations');
      let populatedEntity = repository.getNewPopulatedEntity();

      expect(populatedEntity instanceof WithAssociations).toBe(true);
      expect(populatedEntity.bar instanceof Custom).toBe(true);
      expect(populatedEntity.foo).toEqual([]);
    });

    it('Should compose empty values with .asObject().', function() {
      let repository      = constructRepository('withassociations');
      let populatedEntity = repository.getNewPopulatedEntity();
      let fooOne          = new Foo();
      let fooTwo          = new Foo();

      fooOne.cake   = 'yum';
      fooOne.candy  = 'yummer';
      fooTwo.shaken = 'not stirred';
      fooOne.id     = 1;
      fooTwo.id     = 3; // Haaa, got your nose!

      populatedEntity.foo.push(fooOne);
      populatedEntity.foo.push(fooTwo);

      expect(populatedEntity.asObject()).toEqual({
        bar: {},
        foo: [{id: 1, cake: 'yum', candy: 'yummer'}, {id: 3, shaken: 'not stirred'}]
      });

      expect(populatedEntity.asObject(true)).toEqual({bar: {}});
    });
  });
});
