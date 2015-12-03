import {WithCustomRepository} from '../resources/entity/with-custom-repository';
import {OrmMetadata} from '../../src/orm-metadata';
import {SimpleCustom} from '../resources/repository/simple-custom';

describe('@repository()', function () {
  it('Should set repository metadata on the entity.', function () {
    expect(OrmMetadata.forTarget(WithCustomRepository).fetch('repository')).toBe(SimpleCustom);
  });
});
