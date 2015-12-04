import {WithValidation} from '../resources/entity/with-validation';
import {OrmMetadata} from '../../src/orm-metadata';

describe('@validation()', function () {
  it('Should enable validation on the entity.', function () {
    expect(OrmMetadata.forTarget(WithValidation).fetch('validation')).toBe(true);
  });
});
