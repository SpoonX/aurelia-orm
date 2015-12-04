import {DefaultRepository} from '../src/default-repository';
import {metadata} from 'aurelia-metadata';
import {TransientRegistration} from 'aurelia-dependency-injection';

describe('DefaultRepository', function () {
  it('Should be transient', function () {
    expect(metadata.get(metadata.registration, DefaultRepository) instanceof TransientRegistration).toBe(true);
  });
});
