import {WithEnumeration} from '../resources/entity/with-enumeration';
import {OrmMetadata} from '../../src/orm-metadata';

describe('@enumeration()', function() {
  it('registered the enumerations on state attribute', function() {
    expect(OrmMetadata.forTarget(WithEnumeration).fetch('enumerations', 'state'))
      .toEqual(['starting', 'started', 'running', 'complete']);
  });

  it('did not register enumerations on another attribute', function() {
    expect(OrmMetadata.forTarget(WithEnumeration).fetch('enumerations', 'another'))
      .toEqual(null);
  });
});
