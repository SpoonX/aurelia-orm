var _dec, _class;

import { transient } from 'aurelia-dependency-injection';
import { Repository } from './repository';

export let DefaultRepository = (_dec = transient(), _dec(_class = class DefaultRepository extends Repository {}) || _class);