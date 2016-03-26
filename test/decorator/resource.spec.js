import {WithResource} from '../resources/entity/with-resource';
import {WithCustomRepository} from '../resources/entity/with-custom-repository';
import {OrmMetadata} from '../../src/orm-metadata';

describe('@association()', function() {
  it('Should add associations on the entity (default and custom).', function() {
    expect(OrmMetadata.forTarget(WithResource).fetch('resource')).toEqual('with-resource');
    expect(OrmMetadata.forTarget(WithCustomRepository).fetch('resource')).toEqual('withcustomrepository');
  });
});
