import {WithType} from '../resources/entity/with-type';
import {OrmMetadata} from '../../src/orm-metadata';

describe('@type()', function() {
  it('Should add types for properties on the entity.', function() {
    expect(OrmMetadata.forTarget(WithType).fetch('types', 'created')).toEqual('datetime');
    expect(OrmMetadata.forTarget(WithType).fetch('types', 'disabled')).toEqual('boolean');
    expect(OrmMetadata.forTarget(WithType).fetch('types', 'age')).toEqual('integer');
    expect(OrmMetadata.forTarget(WithType).fetch('types', 'titanic')).toEqual('float');
  });
});
