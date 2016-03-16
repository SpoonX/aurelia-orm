import { EntityManager } from './entity-manager';
import { ValidationGroup } from 'aurelia-validation';
import { HasAssociationValidationRule } from './validator/has-association';

import { DefaultRepository } from './default-repository';
import { Repository } from './repository';
import { Entity } from './entity';
import { OrmMetadata } from './orm-metadata';
import { association } from './decorator/association';
import { resource } from './decorator/resource';
import { endpoint } from './decorator/endpoint';
import { name } from './decorator/name';
import { repository } from './decorator/repository';
import { validation } from './decorator/validation';
import { type } from './decorator/type';
import { validatedResource } from './decorator/validated-resource';

function configure(aurelia, configCallback) {
  let entityManagerInstance = aurelia.container.get(EntityManager);

  configCallback(entityManagerInstance);

  ValidationGroup.prototype.hasAssociation = function () {
    return this.isNotEmpty().passesRule(new HasAssociationValidationRule());
  };

  aurelia.globalResources('./component/association-select');
}

export { configure, DefaultRepository, Repository, Entity, OrmMetadata, EntityManager, association, resource, endpoint, name, repository, validation, type, validatedResource };