import {EntityManager} from '../src/aurelia-orm';
import {Metadata} from '../src/orm-metadata';
import {WithResource} from './resources/entity/with-resource';
import {WithEndpoint} from './resources/entity/with-endpoint';
import {WithValidation} from './resources/entity/with-validation';
import {Foo} from './resources/entity/foo';
import {Custom} from './resources/entity/custom';
import {WithAssociations} from './resources/entity/with-associations';
import {WithName} from './resources/entity/with-name';
import {Entity} from '../src/entity';
import {Container} from 'aurelia-dependency-injection';
import {Config, Rest} from 'aurelia-api';
import {Validation} from 'aurelia-validation';

function getContainer() {
  let container = new Container();
  let config    = container.get(Config);

  config
    .registerEndpoint('sx/default', 'http://localhost:1927/')
    .registerEndpoint('sx/alternative', 'http://127.0.0.1:1927/')
    .setDefaultEndpoint('sx/default');

  return container;
}

function constructEntity(entity) {
  let container     = getContainer();
  let entityManager = new EntityManager(container);

  return entityManager.registerEntity(entity).getEntity(entity.getResource());
}

describe('Entity', function() {
  describe('.constructor()', function() {
    it('Should set the meta data.', function() {
      let validation = new Validation();
      let entity     = new WithValidation(validation);

      expect(entity.__meta).not.toBe(undefined);
    });

    it('Should set the validator constructor.', function() {
      let validation = new Validation();
      let entity     = new WithValidation(validation);

      expect(entity.__validator).toBe(validation);
    });

    it('Should not set the validator constructor.', function() {
      let validation = new Validation();
      let entity     = new WithResource(validation);

      expect(entity.__validator).toBe(undefined);
    });
  });

  describe('.addCollectionAssociation()', function() {
    it('Should properly add collectionAssociations when requested.', function(done) {
      let container     = getContainer();
      let entityManager = new EntityManager(container);
      let testPromises  = [];

      entityManager.registerEntities([WithAssociations, Foo, Custom]);

      let entity       = entityManager.getEntity('withassociations').setData({id: 123});
      let brokenParent = entityManager.getEntity('withassociations');
      let childOne     = entityManager.getEntity('foo').setData({empty: 'child one'});
      let childTwo     = entityManager.getEntity('foo').setData({empty: 'child two'});
      let childThree   = entityManager.getEntity('custom').setData({empty: 'If I must'});
      let childFour    = 1337;

      testPromises.push(entity.addCollectionAssociation(childOne, 'foo'));  // With property
      testPromises.push(entity.addCollectionAssociation(childTwo));         // Without property
      testPromises.push(entity.addCollectionAssociation(childThree));       // With one assoc
      testPromises.push(entity.addCollectionAssociation(childFour, 'foo')); // Without body, only ID

      // Test adding children to parent that hasn't been persisted yet.
      expect(() => {
        brokenParent.addCollectionAssociation(childOne);
      }).toThrowError(Error, 'Cannot add association to entity that does not have an id.');

      // Test results of different ways of adding children to collection
      Promise.all(testPromises).then(response => {
        expect(response[0] instanceof Foo).toBe(true);
        expect(response[1] instanceof Foo).toBe(true);
        expect(response[2] instanceof Custom).toBe(true);
        expect(response[3] instanceof Object).toBe(true);

        expect(typeof response[0].id).toEqual('number');
        expect(typeof response[1].id).toEqual('number');
        expect(typeof response[2].id).toEqual('number');
        expect(response[3].body).toEqual({});

        done();
      }).catch(error => {
        throw error;
      });
    });
  });

  describe('.save()', function() {
    it('Should call .create on REST without an ID. (custom entity)', function(done) {
      let entity = constructEntity(WithResource);
      entity.foo = 'bar';

      entity.save().then(response => {
        expect(response.body).toEqual({foo: 'bar'});
        expect(response.path).toEqual('/with-resource');
        expect(response.method).toEqual('POST');

        done();
      });
    });

    it('Should add and remove collection associations.', function(done) {
      let container     = getContainer();
      let entityManager = new EntityManager(container);

      entityManager.registerEntities([WithAssociations, Foo, Custom]);

      let parentEntity   = entityManager.getEntity('withassociations');
      let fooEntityOne   = entityManager.getEntity('foo');
      let fooEntityTwo   = entityManager.getEntity('foo');
      let fooEntityThree = entityManager.getEntity('foo');
      let fooEntityFour  = entityManager.getEntity('foo');
      let customEntity   = entityManager.getEntity('custom');

      fooEntityOne.id    = 6;
      fooEntityOne.some  = 'value';
      fooEntityOne.other = 'other value';

      fooEntityTwo.id   = 7;
      fooEntityTwo.what = 'Jup';

      fooEntityThree.id   = 8;
      fooEntityThree.what = 'Jup';

      fooEntityFour.id   = 8;
      fooEntityFour.what = 'Jup';

      customEntity.id   = 9;
      customEntity.baby = 'steps';

      parentEntity.id   = 5;
      parentEntity.foo  = [fooEntityOne, fooEntityTwo];
      parentEntity.bar  = customEntity;
      parentEntity.test = 'case';

      parentEntity.markClean();

      spyOn(parentEntity, 'addCollectionAssociation').and.callThrough();
      spyOn(parentEntity, 'removeCollectionAssociation').and.callThrough();
      spyOn(parentEntity, 'saveCollections').and.callThrough();

      parentEntity.foo = [fooEntityOne, fooEntityThree, fooEntityFour];

      // Will cause an error because the response doesn't fit the entity schema.
      parentEntity.save().then(x => {
        expect(parentEntity.addCollectionAssociation).toHaveBeenCalled();
        expect(parentEntity.removeCollectionAssociation).toHaveBeenCalled();
        expect(parentEntity.saveCollections).toHaveBeenCalled();
        expect(parentEntity.addCollectionAssociation.calls.count()).toBe(2);
        expect(parentEntity.removeCollectionAssociation.calls.count()).toBe(1);
        expect(parentEntity.saveCollections.calls.count()).toBe(1);

        done();
      });
    });

    it('Should call .create with the full body.', function(done) {
      let entity  = constructEntity(WithResource);
      entity.foo  = 'bar';
      entity.city = {awesome: true};

      entity.save().then(response => {
        expect(response.body).toEqual({foo: 'bar', city: {awesome: true}});
        expect(response.path).toEqual('/with-resource');
        expect(response.method).toEqual('POST');

        done();
      });
    });

    it('Should call .create with custom endpoint.', function(done) {
      let entity  = constructEntity(WithEndpoint);
      entity.foo  = 'bar';
      entity.city = {awesome: true};

      entity.save().then(response => {
        expect(response.body).toEqual({foo: 'bar', city: {awesome: true}});
        expect(response.host).toEqual('127.0.0.1');
        expect(response.path).toEqual('/withendpoint');
        expect(response.method).toEqual('POST');
        done();
      });
    });

    it('Should call .update on REST with an ID. (custom entity)', function(done) {
      let entity = constructEntity(WithResource);
      entity.foo = 'bar';
      entity.id  = 1337;

      entity.save().then(response => {
        expect(response.body).toEqual({foo: 'bar'});
        expect(response.path).toEqual('/with-resource/1337');
        expect(response.method).toEqual('PUT');

        done();
      });
    });

    it('Should call .create on REST without an ID. (default entity)', function(done) {
      let container = getContainer();

      container.registerInstance(Rest);

      let entityManager = new EntityManager(container);
      let entity        = entityManager.getEntity('default-entity');

      entity.bacon = 'great!';

      entity.save().then(response => {
        expect(response.body).toEqual({bacon: 'great!'});
        expect(response.path).toEqual('/default-entity');
        expect(response.method).toEqual('POST');

        done();
      });
    });

    it('Should call .create on REST with nested body (associations).', function(done) {
      let container     = getContainer();
      let entityManager = new EntityManager(container);

      entityManager.registerEntities([WithAssociations, Foo, Custom]);

      let parentEntity = entityManager.getEntity('withassociations');
      let fooEntityOne = entityManager.getEntity('foo');
      let fooEntityTwo = entityManager.getEntity('foo');
      let customEntity = entityManager.getEntity('custom');

      fooEntityOne.some  = 'value';
      fooEntityOne.other = 'other value';
      fooEntityTwo.what  = 'Jup';
      customEntity.baby  = 'steps';

      parentEntity.setData({
        test: 'case',
        foo: [fooEntityOne, fooEntityTwo],
        bar: customEntity
      });

      parentEntity.save().then(response => {
        let idBar = response.bar.id;
        let idParent = response.id;

        expect(typeof idParent).toEqual('number');
        expect(typeof idBar).toEqual('number');

        expect(response).toEqual({bar: {baby: 'steps', id: idBar}, test: 'case', id: idParent});
        done();
      });
    });

    it('Should call .update on REST with an ID. (default entity)', function(done) {
      let container = getContainer();

      container.registerInstance(Rest);

      let entityManager = new EntityManager(container);
      let entity        = entityManager.getEntity('default-entity');

      entity.bacon = 'great!';
      entity.id    = 1991;

      entity.save().then(response => {
        expect(response.body).toEqual({bacon: 'great!'});
        expect(response.path).toEqual('/default-entity/1991');
        expect(response.method).toEqual('PUT');

        done();
      });
    });
  });

  describe('.define()', function() {
    it('Should define a non-enumerable property on the entity.', function() {
      let entity = new WithResource(new Validation());

      entity.define('__test', 'value');
      entity.define('__testWritable', 'value', true);

      expect(entity.__test).toBe('value');
      expect(entity.__testWritable).toBe('value');
      expect(Object.keys(entity).indexOf('__test')).toBe(-1);
      expect(Object.keys(entity).indexOf('__testWritable')).toBe(-1);

      let testDescriptor         = Object.getOwnPropertyDescriptor(entity, '__test');
      let testWritableDescriptor = Object.getOwnPropertyDescriptor(entity, '__testWritable');

      expect(testDescriptor.enumerable).toBe(false);
      expect(testDescriptor.writable).toBe(false);
      expect(testWritableDescriptor.enumerable).toBe(false);
      expect(testWritableDescriptor.writable).toBe(true);
    });
  });

  describe('.isDirty()', function() {
    it('Should properly return if the entity is dirty.', function() {
      let entity = new WithResource(new Validation());

      entity.setData({
        id: 667,
        foo: 'bar',
        city: {awesome: true}
      }).markClean();

      expect(entity.isDirty()).toBe(false);

      entity.what = 'You dirty, dirty boy.';

      expect(entity.isDirty()).toBe(true);
    });
  });

  describe('.isClean()', function() {
    it('Should properly return if the entity is clean.', function() {
      let entity = new WithResource(new Validation());

      entity.setData({
        id: 667,
        foo: 'bar',
        city: {awesome: true}
      }).markClean();

      expect(entity.isClean()).toBe(true);

      entity.what = 'You dirty, dirty boy.';

      expect(entity.isClean()).toBe(false);
    });
  });

  describe('.isNew()', function() {
    it('Should properly return if the entity is new.', function() {
      let entity = new WithResource(new Validation());

      expect(entity.isNew()).toBe(true);
      entity.setData({id: 667}).markClean();
      expect(entity.isNew()).toBe(false);
    });
  });

  describe('.markClean()', function() {
    it('Should properly mark the entity as clean.', function() {
      let entity = new WithResource(new Validation());

      entity.setData({
        id: 667,
        foo: 'bar',
        city: {awesome: true}
      }).markClean();

      expect(entity.isClean()).toBe(true);

      entity.what = 'You dirty, dirty boy.';

      expect(entity.isClean()).toBe(false);

      entity.markClean();

      expect(entity.isClean()).toBe(true);
    });
  });

  describe('.update()', function() {
    it('Should call .update with complete body.', function(done) {
      let entity  = constructEntity(WithResource);
      entity.id   = 666;
      entity.foo  = 'bar';
      entity.city = {awesome: true};

      entity.update().then(response => {
        expect(response.body).toEqual({foo: 'bar', city: {awesome: true}});
        expect(response.path).toEqual('/with-resource/666');
        expect(response.method).toEqual('PUT');

        done();
      });
    });

    it('Should not send a PUT request for .update when clean.', function(done) {
      let entity = constructEntity(WithResource);
      entity.setData({
        id: 667,
        foo: 'bar',
        city: {awesome: true}
      }).markClean();

      entity.update().then(response => {
        expect(response).toEqual(null);

        done();
      });
    });

    it('Should throw an error with missing id.', function() {
      let entity = constructEntity(WithResource);
      entity.foo = 'bar';

      expect(function() {
        entity.update();
      }).toThrowError(Error, 'Required value "id" missing on entity.');
    });

    it('Should call .update on REST with nested body (associations).', function(done) {
      let container     = getContainer();
      let entityManager = new EntityManager(container);

      entityManager.registerEntities([WithAssociations, Foo, Custom]);

      let parentEntity = entityManager.getEntity(WithAssociations);
      let fooEntityOne = entityManager.getEntity(Foo);
      let fooEntityTwo = entityManager.getEntity(Foo);
      let customEntity = entityManager.getEntity(Custom);

      fooEntityOne.some  = 'value';
      fooEntityOne.other = 'other value';
      fooEntityTwo.what  = 'Jup';
      customEntity.baby  = 'steps';

      parentEntity.setData({
        id: 1,
        test: 'case',
        foo: [fooEntityOne, fooEntityTwo],
        bar: customEntity
      });

      parentEntity.save().then(response => {
        expect(response.path).toEqual('/withassociations/1');
        expect(response.method).toEqual('PUT');
        expect(response.body).toEqual({
          bar: {
            baby: 'steps'
          },
          test: 'case'
        });

        done();
      });
    });
  });

  describe('.getMeta()', function() {
    it('Should return the entity metadata', function() {
      let instance = new WithResource();

      expect(instance.getMeta() instanceof Metadata).toBe(true);
    });
  });

  describe('static .getResource()', function() {
    it('Should return the entity resource. (Default)', function() {
      expect(Entity.getResource()).toEqual(null);
    });

    it('Should return the entity resource. (Custom)', function() {
      expect(WithResource.getResource()).toEqual('with-resource');
    });
  });

  describe('.getResource()', function() {
    it('Should return the entity resource. (Default)', function() {
      let instance = new Entity();

      expect(instance.getResource()).toEqual(null);
    });

    it('Should return the entity resource. (Custom)', function() {
      let instance = new WithResource();

      expect(instance.getResource()).toEqual('with-resource');
    });
  });

  describe('static .getName()', function() {
    it('Should return the entity name.', function() {
      expect(WithName.getName()).toEqual('cool name');
      expect(WithResource.getName()).toEqual('with-resource');
      expect(Entity.getName()).toEqual(null);
    });
  });

  describe('.getName()', function() {
    it('Should return the entity name.', function() {
      let withName     = new WithName();
      let withResource = new WithResource();
      let entity       = new Entity();

      expect(withName.getName()).toEqual('cool name');
      expect(withResource.getName()).toEqual('with-resource');
      expect(entity.getName()).toEqual(null);
    });
  });

  describe('.setResource()', function() {
    it('Should set the entity resource. (Default)', function() {
      let instance = new Entity();

      instance.setResource('testing-resource');

      expect(instance.getResource()).toEqual('testing-resource');
    });

    it('Should set the entity resource. (Custom)', function() {
      let instance = new WithResource();

      instance.setResource('testing-resource-again');

      expect(instance.getResource()).toEqual('testing-resource-again');
    });
  });

  describe('.destroy()', function() {
    it('Should call .destroy.', function(done) {
      let entity = constructEntity(WithResource);
      entity.id  = 666;

      entity.destroy().then(response => {
        expect(response.path).toEqual('/with-resource/666');
        expect(response.method).toEqual('DELETE');

        done();
      });
    });

    it('Should throw an error with missing id.', function() {
      let entity = constructEntity(WithResource);

      expect(function() {
        entity.destroy();
      }).toThrowError(Error, 'Required value "id" missing on entity.');
    });
  });

  describe('.setData()', function() {
    it('Should set data on an entity.', function() {
      let entity = new Entity();

      entity.setResource('unittest .setDate');

      entity.setData({cake: 'delicious', but: 'So is bacon'});

      expect(entity.cake).toEqual('delicious');
      expect(entity.but).toEqual('So is bacon');
      expect(entity.asObject()).toEqual({cake: 'delicious', but: 'So is bacon'});
    });
  });

  describe('.enableValidation()', function() {
    it('Should enable validation on the entity.', function() {
      let mockValidator = {
        on: function() {
          return {};
        }
      };

      spyOn(mockValidator, 'on');

      let entity = new WithValidation(mockValidator);

      entity.enableValidation();

      expect(mockValidator.on).toHaveBeenCalled();
    });

    it('Should throw an error when called with validation disabled', function() {
      let entity = new WithResource({});

      expect(function() {
        entity.enableValidation();
      }).toThrowError(Error, 'Entity not marked as validated. Did you forget the @validation() decorator?');
    });

    it('Should not enable validation on the entity more than once.', function() {
      let mockValidatorMultiple = {
        on: function() {
          return {};
        }
      };

      spyOn(mockValidatorMultiple, 'on').and.callThrough();

      let entity = new WithValidation(mockValidatorMultiple);

      entity.enableValidation();

      expect(mockValidatorMultiple.on).toHaveBeenCalled();

      entity.enableValidation();
      entity.enableValidation();
      entity.enableValidation();

      expect(mockValidatorMultiple.on.calls.count()).toBe(1);
    });
  });

  describe('.getValidation()', function() {
    it('Should return null if validation meta is not true.', function() {
      let entity = new WithResource('space camp');

      expect(entity.getValidation()).toBe(null);
    });

    it('Should return validation for the entity (and create the instance).', function() {
      let mockValidator = {
        on: function() {
          return 'The validator. But, not really.';
        }
      };

      let entity = new WithValidation(mockValidator);

      // Instance
      expect(entity.getValidation()).toEqual('The validator. But, not really.');

      // Cached
      expect(entity.getValidation()).toEqual('The validator. But, not really.');
    });
  });

  describe('.hasValidation()', function() {
    it('Should return entity has validation disabled.', function() {
      let entity = new WithResource({});

      expect(entity.hasValidation()).toEqual(false);
    });

    it('Should return entity has validation enabled.', function() {
      let entity = new WithValidation({});

      expect(entity.hasValidation()).toEqual(true);
    });
  });

  describe('.asObject()', function() {
    it('Should return a POJO (simple).', function() {
      let entity     = new Entity();
      let entityData = {
        foo: 'bar',
        some: 'properties',
        nothing: 'special'
      };

      entity.setResource('unittest .asObject simple');

      entity.setData(entityData);

      expect(entity.asObject()).toEqual(entityData);
    });

    it('Should return a POJO (complex).', function() {
      let entity     = new Entity();
      let entityData = {
        foo: 'bar',
        some: 'properties',
        nothing: 'special',
        also: {
          something: 'Nested!'
        }
      };

      entity.setResource('unittest .asJson complex');
      entity.setData(entityData);

      expect(entity.asObject()).toEqual(entityData);
    });

    it('Should return a POJO (associations).', function() {
      let parentEntity = new WithAssociations();
      let fooEntityOne = new Foo();
      let fooEntityTwo = new Foo();
      let customEntity = new Custom();

      fooEntityOne.some  = 'value';
      fooEntityOne.other = 'other value';
      fooEntityTwo.what  = 'Jup';
      customEntity.baby  = 'steps';

      parentEntity.setData({
        test: 'case',
        foo: [fooEntityOne, fooEntityTwo],
        bar: customEntity
      });

      expect(parentEntity.asObject()).toEqual({
        foo: [
          {some: 'value', other: 'other value'},
          {what: 'Jup'}
        ],
        bar: {
          baby: 'steps'
        },
        test: 'case'
      });
    });

    it('Should return a POJO (associations with shallow set to true).', function() {
      let parentEntity = new WithAssociations();
      let fooEntityOne = new Foo();
      let fooEntityTwo = new Foo();
      let customEntity = new Custom();

      fooEntityOne.id    = 6;
      fooEntityOne.some  = 'value';
      fooEntityOne.other = 'other value';
      fooEntityTwo.what  = 'Jup';
      customEntity.baby  = 'steps';

      parentEntity.setData({
        test: 'case',
        foo: [fooEntityOne, fooEntityTwo],
        bar: customEntity
      });

      expect(parentEntity.asObject(true)).toEqual({
        bar: {
          baby: 'steps'
        },
        test: 'case'
      });
    });

    it('Should return a POJO and not break on empty association.', function() {
      let parentEntity = new WithAssociations();
      let fooEntityOne = new Foo();
      let fooEntityTwo = new Foo();
      let customEntity = new Custom();

      fooEntityOne.some  = 'value';
      fooEntityOne.other = 'other value';
      fooEntityTwo.what  = 'Jup';
      customEntity.baby  = 'steps';

      parentEntity.setData({
        test: 'case',
        foo: null,
        bar: customEntity
      });

      expect(parentEntity.asObject()).toEqual({
        foo: null,
        bar: {
          baby: 'steps'
        },
        test: 'case'
      });
    });
  });

  describe('.asJson()', function() {
    it('Should return a JSON string (simple).', function() {
      let entity     = new Entity();
      let entityData = {
        foo: 'bar',
        some: 'properties',
        nothing: 'special'
      };

      entity.setResource('unittest .asJson simple');
      entity.setData(entityData);

      expect(entity.asJson()).toEqual('{"foo":"bar","some":"properties","nothing":"special"}');
    });

    it('Should return a JSON string (complex).', function() {
      let entity     = new Entity();
      let entityData = {
        foo: 'bar',
        some: 'properties',
        nothing: 'special',
        also: {
          something: 'Nested!'
        }
      };

      entity.setResource('unittest .asJson complex');

      entity.setData(entityData);

      expect(entity.asJson()).toEqual('{"foo":"bar","some":"properties","nothing":"special","also":{"something":"Nested!"}}');
    });

    it('Should return a POJO (associations).', function() {
      let parentEntity = new WithAssociations();
      let fooEntityOne = new Foo();
      let fooEntityTwo = new Foo();
      let customEntity = new Custom();

      fooEntityOne.some  = 'value';
      fooEntityOne.other = 'other value';
      fooEntityTwo.what  = 'Jup';
      customEntity.baby  = 'steps';

      parentEntity.setData({
        test: 'case',
        foo: [fooEntityOne, fooEntityTwo],
        bar: customEntity
      });

      expect(parentEntity.asJson()).toEqual('{"foo":[{"some":"value","other":"other value"},{"what":"Jup"}],"bar":{"baby":"steps"},"test":"case"}');
    });
  });
});
