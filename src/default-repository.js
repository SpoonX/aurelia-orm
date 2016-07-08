import {transient} from 'aurelia-dependency-injection';
import {Repository} from './repository';

/**
 * The DefaultRepository class
 * @transient
 */
@transient()
export class DefaultRepository extends Repository {
}
