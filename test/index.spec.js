import {configure} from '../src/index';
import {Entity} from  '../src/entity-manager';
import {Container} from 'aurelia-dependency-injection';
import {EntityManager} from '../src/entity-manager';

describe('index', function () {
  it('Should export a configure method which returns the entityManager', function () {
    expect(typeof configure).toEqual('function');

    configure({container: new Container(), globalResources: function () {}}, function (entityManager) {
      expect(entityManager instanceof EntityManager).toBe(true);
    });
  });
});
