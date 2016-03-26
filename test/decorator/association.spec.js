import {WithAssociations} from '../resources/entity/with-associations';
import {OrmMetadata} from '../../src/orm-metadata';

describe('@association()', function() {
  it('Should add associations on the entity (default and custom).', function() {
    expect(OrmMetadata.forTarget(WithAssociations).fetch('associations')).toEqual({
      foo: {entity: 'foo', type: 'collection'},
      bar: {entity: 'custom', type: 'entity'}
    });
  });
});
