import {DOM} from 'aurelia-pal';
import {StageComponent} from './../component-tester';

describe('like-button', () => {
  describe('with defaults', () => {
    let component;

    // create, bootstrap and attach custom element
    beforeAll( done => {
      // set binding context
      component = StageComponent
        .withResources('src/component/association-select')
        .inView('<association-select></association-select>')
        .boundTo({});

      // bootstrap component
      component.bootstrap(aurelia => {
        aurelia.use.standardConfiguration();
      });

      // create component and continue
      component.create().then(done);
    });

    // remove custom element
    afterAll( () => {
      let associationSelect = component.element.querySelectorAll('.au-target')[0];
      DOM.removeNode(associationSelect, associationSelect.parentNode);
    });

    it('bind element options', () => {
      let associationSelect = component.element.querySelectorAll('.au-target')[0];
      expect(associationSelect).toBeDefined();
      expect(associationSelect.getAttribute('class')).toMatch('form-control au-target');
      expect(associationSelect.getAttribute('value.bind')).toBe('value');
      expect(associationSelect.getAttribute('multiple.bind')).toBe('multiple');

      // expect load promise to fail. need fixing of the component code
    });
  });
  describe('with bound options', () => {
    let component;

    // create, bootstrap and attach custom element
    beforeAll( done => {
      // set binding context
      component = StageComponent
        .withResources('src/component/association-select')
        .inView('<association-select></association-select>')
        .boundTo({value: 'repo', multiple: 'false'});

      // bootstrap component
      component.bootstrap(aurelia => {
        aurelia.use.standardConfiguration();
      });

      // create component and continue
      component.create().then(done);
    });

    // remove custom element
    afterAll( () => {
      let associationSelect = component.element.querySelectorAll('.au-target')[0];
      DOM.removeNode(associationSelect, associationSelect.parentNode);
    });

    it('bind element options', () => {
      let associationSelect = component.element.querySelectorAll('.au-target')[0];
      expect(associationSelect).toBeDefined();
      expect(associationSelect.getAttribute('class')).toMatch('form-control au-target');
      expect(associationSelect.getAttribute('value.bind')).toBe('value');
      expect(associationSelect.getAttribute('multiple.bind')).toBe('multiple');

      // expect load promise to fail. need fixing of the component code
    });
  });
});
