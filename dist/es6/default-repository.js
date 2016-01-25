import {transient} from 'aurelia-dependency-injection';
import {Repository} from './repository';

@transient()
export class DefaultRepository extends Repository {
}
