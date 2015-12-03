import {EntityManager} from './entity-manager';

export {DefaultRepository} from './default-repository';
export {Repository} from './repository';
export {Entity} from './entity';
export {EntityManager} from './entity-manager';
export {association} from './decorator/association';
export {resource} from './decorator/resource';
export {repository} from './decorator/repository';
export {validation} from './decorator/validation';
export {validatedResource} from './decorator/validated-resource';

export function configure (aurelia, configCallback) {
  let entityManagerInstance = aurelia.container.get(EntityManager);

  configCallback(entityManagerInstance);
}
