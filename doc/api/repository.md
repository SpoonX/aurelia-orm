Docs for the {`Repository`} class
=======

A `Repository` allows you to retrieve entities, populate them with data and more.
It can also be extended, allowing you to supply your custom `Repository`.

-----

.find(criteria[, raw = false])
------

Find data on the server using supplied criteria. If `raw` has been set to true, the `Repository` **won't** populate the results into entities and return POJOs.

### Parameters

| Parameter | Type           | Description                                           |
| --------- | -------------- | ----------------------------------------------------- |
| criteria  | object/integer | A specific ID, or object of supported filters.        |
| raw       | boolean        | Whether or not to populate the results into entities. |

### Returns
A new `Promise` to be resolved when `.find()` has completed.

### Examples

```javascript
import {inject}        from 'aurelia-framework';
import {EntityManager} from 'spoonx/aurelia-orm';

@inject(EntityManager)
export class SomeViewModel {
  constructor (entityManager) {
    let repository = entityManager.getRepository('user');
    
    // Find a single record.
    repository.find(7)
      .then(console.log)
      .catch(console.error);
  }
}
```

--------

.getPopulatedEntity(data)
------

Populates a fresh entity with supplied data.

**Note:** This method also populates **associations** on the entity.

### Parameters

| Parameter | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| data      | object | Data to populate the new entity with. |

### Returns

A new `Entity` instance with the populated data.

### Examples

```javascript
import {inject}        from 'aurelia-framework';
import {EntityManager} from 'spoonx/aurelia-orm';

@inject(EntityManager)
export class SomeViewModel {
  constructor (entityManager) {
    let repository = entityManager.getRepository('user');
    
    // Create a new entity
    repository
      .getPopulatedEntity({username: 'bob', password: 'bacon'})
      .save()
      .then(console.log)
      .catch(console.error);
  }
}
```

--------

.populateEntities(data)
-------

Calls [.getPopulatedEntity()](#getpopulatedentitydata) for every object in data (also works when given an object in stead of an array).

### Parameters

| Parameter | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| data      | object/array | Data to populate the new entity with. |

### Returns

A new `Entity` instance with the populated data, or an array or `Entity` instances.

### Examples

```javascript
import {inject}        from 'aurelia-framework';
import {EntityManager} from 'spoonx/aurelia-orm';

@inject(EntityManager)
export class SomeViewModel {
  constructor (entityManager) {
    let repository = entityManager.getRepository('notes');
    
    // entities is an array of Entity instances.
    let entities = repository.populateEntities([{note: 'laundry'}, {note: 'bacon'}]);
  }
}
```
