import {configure} from '../src/aurelia-orm';
import {Container} from 'aurelia-dependency-injection';
import {EntityManager} from '../src/entity-manager';

describe('aurelia-orm', function() {
  it('Should export a configure method which returns the entityManager', function() {
    expect(typeof configure).toEqual('function');

    configure({container: new Container(), globalResources: function() {}}, function(entityManager) {
      expect(entityManager instanceof EntityManager).toBe(true);
    });
  });
});
