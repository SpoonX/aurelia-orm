import {bindable, inject} from 'aurelia-framework';
import {bindingMode, BindingEngine} from 'aurelia-binding';
import {customElement} from 'aurelia-templating';
import {EntityManager, OrmMetadata} from '../index';
import extend from 'extend';

@customElement('association-select')
@inject(BindingEngine, EntityManager)
export class AssociationSelect {
  @bindable criteria = null;

  @bindable repository;

  @bindable property = 'name';

  @bindable options;

  @bindable association;

  @bindable manyAssociation;

  @bindable({defaultBindingMode: bindingMode.twoWay}) value;

  ownMeta;

  /**
   * Create a new select element.
   *
   * @param {BindingEngine} bindingEngine
   * @param {EntityManager} entityManager
   */
  constructor(bindingEngine, entityManager) {
    this._subscriptions = [];
    this.bindingEngine  = bindingEngine;
    this.entityManager  = entityManager;
  }

  /**
   * (Re)Load the data for the select.
   */
  load() {
    this.buildFind()
      .then(options => {
        let result   = options;
        this.options = Array.isArray(result) ? result : [result];
      });
  }

  /**
   * Get criteria, or default to empty object.
   *
   * @return {{}}
   */
  getCriteria() {
    if (typeof this.criteria !== 'object') {
      return {};
    }

    return extend(true, {}, this.criteria);
  }

  /**
   * Build the find that's going to fetch the option values for the select.
   * This method works well with associations, and reloads when they change.
   *
   * @return {Promise}
   */
  buildFind() {
    let repository = this.repository;
    let criteria   = this.getCriteria();
    let findPath   = repository.getResource();

    // Check if there are `many` associations. If so, the repository find path changes.
    // the path will become `/:association/:id/:entity`.
    if (this.manyAssociation) {
      let assoc = this.manyAssociation;

      let property = this.propertyForResource(assoc.getMeta(), repository.getResource());
      findPath     = `${assoc.getResource()}/${assoc.id}/${property}`;
    } else if (this.association) {
      let associations = Array.isArray(this.association) ? this.association : [this.association];

      associations.forEach(association => {
        criteria[this.propertyForResource(this.ownMeta, association.getResource())] = association.id;
      });
    } else {
      criteria.populate = false;
    }

    return repository.findPath(findPath, criteria);
  }

  /**
   * Check if all associations have values set.
   *
   * @return {boolean}
   */
  verifyAssociationValues() {
    if (this.manyAssociation) {
      return !!this.manyAssociation.id;
    }

    if (this.association) {
      let associations = Array.isArray(this.association) ? this.association : [this.association];

      return !associations.some(association => {
        return !association.id;
      });
    }

    return true;
  }

  /**
   * Add a watcher to the list. Whenever given association changes, the select will reload its contents.
   *
   * @param {Entity|Array} association Entity or array of Entity instances.
   *
   * @return {AssociationSelect}
   */
  observe(association) {
    if (Array.isArray(association)) {
      association.forEach(assoc => this.observe(assoc));

      return this;
    }

    this._subscriptions.push(this.bindingEngine.propertyObserver(association, 'id').subscribe(() => {
      if (this.verifyAssociationValues()) {
        return this.load();
      }

      this.options = undefined;
    }));

    return this;
  }

  /**
   * When attached to the DOM, initialize the component.
   */
  attached() {
    if (!this.association && !this.manyAssociation) {
      this.load();

      return;
    }

    this.ownMeta = OrmMetadata.forTarget(this.entityManager.resolveEntityReference(this.repository.getResource()));

    if (this.manyAssociation) {
      this.observe(this.manyAssociation);
    }

    if (this.association) {
      this.observe(this.association);
    }
  }

  /**
   * Find the name of the property in meta, reversed by resource.
   *
   * @param {Metadata} meta
   * @param {string}   resource
   *
   * @return {string}
   */
  propertyForResource(meta, resource) {
    let associations = meta.fetch('associations');

    return Object.keys(associations).filter(key => {
      return associations[key] === resource;
    })[0];
  }

  /**
   * Dispose all subscriptions on unbind.
   */
  unbind() {
    this._subscriptions.forEach(subscription => subscription.dispose());
  }
}
