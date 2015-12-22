System.register(['./entity-manager', 'aurelia-validation', './validator/has-association', './default-repository', './repository', './entity', './orm-metadata', './decorator/association', './decorator/resource', './decorator/repository', './decorator/validation', './decorator/validated-resource'], function (_export) {
  'use strict';

  var EntityManager, ValidationGroup, HasAssociationValidationRule;

  _export('configure', configure);

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

      _export('EntityManager', _entityManager.EntityManager);
    }, function (_aureliaValidation) {
      ValidationGroup = _aureliaValidation.ValidationGroup;
    }, function (_validatorHasAssociation) {
      HasAssociationValidationRule = _validatorHasAssociation.HasAssociationValidationRule;
    }, function (_defaultRepository) {
      _export('DefaultRepository', _defaultRepository.DefaultRepository);
    }, function (_repository) {
      _export('Repository', _repository.Repository);
    }, function (_entity) {
      _export('Entity', _entity.Entity);
    }, function (_ormMetadata) {
      _export('OrmMetadata', _ormMetadata.OrmMetadata);
    }, function (_decoratorAssociation) {
      _export('association', _decoratorAssociation.association);
    }, function (_decoratorResource) {
      _export('resource', _decoratorResource.resource);
    }, function (_decoratorRepository) {
      _export('repository', _decoratorRepository.repository);
    }, function (_decoratorValidation) {
      _export('validation', _decoratorValidation.validation);
    }, function (_decoratorValidatedResource) {
      _export('validatedResource', _decoratorValidatedResource.validatedResource);
    }],
    execute: function () {}
  };
});