import {WithValidatedResource} from '../resources/entity/with-validated-resource';
import {WithValidatedCustomResource} from '../resources/entity/with-validated-custom-resource';
import {OrmMetadata} from '../../src/orm-metadata';
import {Validator} from 'aurelia-validation';

describe('@validatedResource()', function() {
  it('Should set resource and enable validation on the entity.', function() {
    expect(!!OrmMetadata.forTarget(WithValidatedResource).fetch('validation')).toBe(true);
    expect(OrmMetadata.forTarget(WithValidatedResource).fetch('validation')).toBe(Validator);
    expect(OrmMetadata.forTarget(WithValidatedResource).fetch('resource')).toEqual('withvalidatedresource');

    expect(!!OrmMetadata.forTarget(WithValidatedCustomResource).fetch('validation')).toBe(true);
    expect(OrmMetadata.forTarget(WithValidatedCustomResource).fetch('validation')).toBe(Validator);
    expect(OrmMetadata.forTarget(WithValidatedCustomResource).fetch('resource')).toEqual('holy-cow');
  });
});
