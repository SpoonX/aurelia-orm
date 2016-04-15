define(['exports', './entity-manager', 'aurelia-validation', './validator/has-association', './default-repository', './repository', './entity', './orm-metadata', './decorator/association', './decorator/resource', './decorator/endpoint', './decorator/name', './decorator/repository', './decorator/validation', './decorator/type', './decorator/validated-resource', './component/association-select'], function (exports, _entityManager, _aureliaValidation, _hasAssociation, _defaultRepository, _repository, _entity, _ormMetadata, _association, _resource, _endpoint, _name, _repository2, _validation, _type, _validatedResource) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.validatedResource = exports.type = exports.validation = exports.repository = exports.name = exports.endpoint = exports.resource = exports.association = exports.EntityManager = exports.OrmMetadata = exports.Entity = exports.Repository = exports.DefaultRepository = exports.configure = undefined;


  function configure(aurelia, configCallback) {
    var entityManagerInstance = aurelia.container.get(_entityManager.EntityManager);

    configCallback(entityManagerInstance);

    _aureliaValidation.ValidationGroup.prototype.hasAssociation = function () {
      return this.isNotEmpty().passesRule(new _hasAssociation.HasAssociationValidationRule());
    };

    aurelia.globalResources('./component/association-select');
  }

  exports.configure = configure;
  exports.DefaultRepository = _defaultRepository.DefaultRepository;
  exports.Repository = _repository.Repository;
  exports.Entity = _entity.Entity;
  exports.OrmMetadata = _ormMetadata.OrmMetadata;
  exports.EntityManager = _entityManager.EntityManager;
  exports.association = _association.association;
  exports.resource = _resource.resource;
  exports.endpoint = _endpoint.endpoint;
  exports.name = _name.name;
  exports.repository = _repository2.repository;
  exports.validation = _validation.validation;
  exports.type = _type.type;
  exports.validatedResource = _validatedResource.validatedResource;
});