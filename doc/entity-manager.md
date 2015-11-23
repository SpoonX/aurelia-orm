Docs for the {`EntityManager`}
=======

The `EntityManager` allows you to fetch data from the server via `Repositories` and `Entities`.
It depends on [aurelia-api](https://github.com/SpoonX/aurelia-api), which it uses to talk to the server.

### Example:

```javascript
import {inject}        from 'aurelia-framework';
import {EntityManager} from 'spoonx/aurelia-orm';
import UserEntity      from 'entity/user';

@inject(EntityManager)
export class SomeUpdateViewModel {
  constructor (entityManager) {
    this.repository = entityManager.getRepository(UserEntity);
  }

  activate (params) {
    return this.repository.find(params.id)
      .then(result => {
        this.entity = result;
      })
      .catch(console.error);
  }

  update () {
    this.entity.save()
      .then(result => {
        this.notification.success('User updated successfully', result);
      })
      .catch(error => {
        console.error(error);
      });
  }
}
```
-----

.getRepository(referenceOrResource)
------

Get a repository based on either a 'resource' name, or a custom  `Repository` or `Entity` reference. When using an `Entity` reference or 'resource' string, the `EntityManager` will return a default repository for the supplied endpoint.

### Parameters

| Parameter           | Type                     | Description                  |
| ------------------- | ------------------------ | ---------------------------- |
| referenceOrResource | string/Entity/Repository | Reference or resource string |

### Returns
A `Repository` instance.

### Examples

```javascript
import {inject}           from 'aurelia-framework';
import {EntityManager} 	  from 'spoonx/aurelia-orm';
import UserEntity         from 'entity/user';
import CategoryRepository from 'repository/category';

@inject(EntityManager)
export class SomeUpdateViewModel {
  constructor (entityManager) {
    // Get a default repository for the User entity
    entityManager.getRepository(UserEntity);
    
    // Get a default repository and entity for the 'article' resource
    entityManager.getRepository('article');
    
    // Get a custom repository for the CategoryRepository reference
    entityManager.getRepository(CategoryRepository);
  }
}
```

--------

.getEntity(referenceOrResource)
------

Get an entity instance based on either a 'resource' name, or a custom `Entity` reference. When using a 'resource' string, the `EntityManager` will return a default Entity for the supplied resource.

### Parameters

| Parameter           | Type          | Description                  |
| ------------------- | ------------- | ---------------------------- |
| referenceOrResource | string/Entity | Reference or resource string |

### Returns
An `Entity` instance.

### Examples

```javascript
import {inject}           from 'aurelia-framework';
import {EntityManager} 	  from 'spoonx/aurelia-orm';
import UserEntity         from 'entity/user';
import CategoryRepository from 'repository/category';

@inject(EntityManager)
export class SomeUpdateViewModel {
  constructor (entityManager) {
    // Get a custom Entity instance for the User entity
    entityManager.getEntity(UserEntity);
    
    // Get a default entity for the 'article' resource
    entityManager.getEntity('article');
  }
}
```
