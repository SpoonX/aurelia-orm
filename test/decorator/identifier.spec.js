import {WithIdentifier} from '../resources/entity/with-identifier';
import {FirstWithSameResource, SecondWithSameResource} from '../resources/entity/with-same-resource';
import {FirstWithSameResourceAndIdentifier, SecondWithSameResourceAndIdentifier} from '../resources/entity/with-same-resource-and-identifier';
import {OrmMetadata} from '../../src/orm-metadata';
import {Entity} from '../../src/entity';
import {EntityManager} from '../../src/entity-manager';
import {Container} from 'aurelia-dependency-injection';

describe('@identifier()', function () {
  it('Should add identifier on the entity', function () {
    expect(OrmMetadata.forTarget(WithIdentifier).fetch('identifier')).toEqual('with-identifier');
  });

  it('Should override the first entity when the same resource key is used without the identifier decorator', function () {
    let entityManager = new EntityManager(new Container());

    entityManager.registerEntities([FirstWithSameResource, SecondWithSameResource]);

    expect(Object.keys(entityManager.entities).length).toBe(1);

    expect(entityManager.entities).toEqual({ 'with-duplicated-resource': SecondWithSameResource });
    expect(entityManager.entities).not.toEqual({ 'with-duplicated-resource': FirstWithSameResource });
  });

  it('Should register two entities when the identifier decorator is applied with both the same resource name', function () {
    let entityManager = new EntityManager(new Container());

    entityManager.registerEntities([FirstWithSameResourceAndIdentifier, SecondWithSameResourceAndIdentifier]);

    expect(Object.keys(entityManager.entities).length).toBe(2);

    expect(OrmMetadata.forTarget(FirstWithSameResourceAndIdentifier).fetch('identifier')).toEqual('with-identifier-foo');
    expect(OrmMetadata.forTarget(FirstWithSameResourceAndIdentifier).fetch('resource')).toEqual('with-duplicated-resource');
    expect(OrmMetadata.forTarget(FirstWithSameResourceAndIdentifier).fetch('endpoint')).toEqual('with-endpoint-foo');

    expect(OrmMetadata.forTarget(SecondWithSameResourceAndIdentifier).fetch('identifier')).toEqual('with-identifier-bar');
    expect(OrmMetadata.forTarget(SecondWithSameResourceAndIdentifier).fetch('resource')).toEqual('with-duplicated-resource');
    expect(OrmMetadata.forTarget(SecondWithSameResourceAndIdentifier).fetch('endpoint')).toEqual('with-endpoint-bar');
  });
});
