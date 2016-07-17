import {WithEndpoint} from '../resources/entity/with-endpoint';
import {Foo} from '../resources/entity/foo';
import {OrmMetadata} from '../../src/orm-metadata';
import {EntityManager} from '../../src/entity-manager';
import {Container} from 'aurelia-dependency-injection';
import {Config} from 'aurelia-api';

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

describe('@endpoint()', function() {
  it('Should should set the provided endpoint.', function() {
    expect(OrmMetadata.forTarget(Foo).fetch('endpoint')).toEqual(null);
    expect(OrmMetadata.forTarget(WithEndpoint).fetch('endpoint')).toEqual('sx/alternative');
  });

  it('Should set the corresponding transport.', function() {
    let customEntity  = constructEntity(WithEndpoint);
    let defaultEntity = constructEntity(Foo);

    expect(defaultEntity.getTransport().client.baseUrl).toEqual('http://localhost:1927/');
    expect(customEntity.getTransport().client.baseUrl).toEqual('http://127.0.0.1:1927/');
  });
});
