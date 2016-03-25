'use strict';

System.register(['./entity-manager', 'aurelia-validation', './validator/has-association', './default-repository', './repository', './entity', './orm-metadata', './decorator/association', './decorator/resource', './decorator/endpoint', './decorator/name', './decorator/repository', './decorator/validation', './decorator/type', './decorator/validated-resource'], function (_export, _context) {
  var EntityManager, ValidationGroup, HasAssociationValidationRule, DefaultRepository, Repository, Entity, OrmMetadata, association, resource, endpoint, name, repository, validation, type, validatedResource;


  function configure(aurelia, configCallback) {
    var entityManagerInstance = aurelia.container.get(EntityManager);

    configCallback(entityManagerInstance);

    ValidationGroup.prototype.hasAssociation = function () {
      return this.isNotEmpty().passesRule(new HasAssociationValidationRule());
    };

    aurelia.globalResources('./component/association-select');
  }

  return {
    setters: [function (_entityManager) {
      EntityManager = _entityManager.EntityManager;
    }, function (_aureliaValidation) {
      ValidationGroup = _aureliaValidation.ValidationGroup;
    }, function (_validatorHasAssociation) {
      HasAssociationValidationRule = _validatorHasAssociation.HasAssociationValidationRule;
    }, function (_defaultRepository) {
      DefaultRepository = _defaultRepository.DefaultRepository;
    }, function (_repository) {
      Repository = _repository.Repository;
    }, function (_entity) {
      Entity = _entity.Entity;
    }, function (_ormMetadata) {
      OrmMetadata = _ormMetadata.OrmMetadata;
    }, function (_decoratorAssociation) {
      association = _decoratorAssociation.association;
    }, function (_decoratorResource) {
      resource = _decoratorResource.resource;
    }, function (_decoratorEndpoint) {
      endpoint = _decoratorEndpoint.endpoint;
    }, function (_decoratorName) {
      name = _decoratorName.name;
    }, function (_decoratorRepository) {
      repository = _decoratorRepository.repository;
    }, function (_decoratorValidation) {
      validation = _decoratorValidation.validation;
    }, function (_decoratorType) {
      type = _decoratorType.type;
    }, function (_decoratorValidatedResource) {
      validatedResource = _decoratorValidatedResource.validatedResource;
    }],
    execute: function () {
      _export('configure', configure);

      _export('DefaultRepository', DefaultRepository);

      _export('Repository', Repository);

      _export('Entity', Entity);

      _export('OrmMetadata', OrmMetadata);

      _export('EntityManager', EntityManager);

      _export('association', association);

      _export('resource', resource);

      _export('endpoint', endpoint);

      _export('name', name);

      _export('repository', repository);

      _export('validation', validation);

      _export('type', type);

      _export('validatedResource', validatedResource);
    }
  };
});