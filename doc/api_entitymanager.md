# EntityManager class

The `EntityManager` allows you to manage `Repositories` and `Entities`.

-----

## .getRepository(referenceOrResource)

Get a repository based on either a resource name, or a custom  `Entity` reference.
When using an `Entity` reference with a custom repository configured, the `EntityManager` will return that.

### Parameters

| Parameter           | Type          | Description                  |
| ------------------- | ------------- | ---------------------------- |
| referenceOrResource | string/Entity | Reference or resource string |

### Returns

A `Repository` instance.

### Examples

```js
import {inject}        from 'aurelia-framework';
import {EntityManager} from 'aurelia-orm';
import {UserEntity}    from 'entity/user';

@inject(EntityManager)
export class SomeUpdateViewModel {
  constructor (entityManager) {
    // Return the repository configured for user, otherwise it returns the DefaultRepository
    entityManager.getRepository('user');
    
    // Return the repository by Entity class
    entityManager.getRepository(UserEntity);
  }
}
```

-----

## .getEntity(referenceOrResource)

Get an entity instance based on either a 'resource' name, or a custom `Entity` reference.
When unable to resolve to an entity, the `EntityManager` will return a default Entity for the supplied resource.

**Note:** Even though using a reference works, it's best to use the resource name for consistency.

### Parameters

| Parameter           | Type          | Description                  |
| ------------------- | ------------- | ---------------------------- |
| referenceOrResource | string/Entity | Reference or resource string |

### Returns

An `Entity` instance.

### Examples

```js
import {inject}        from 'aurelia-framework';
import {EntityManager} from 'aurelia-orm';
import {UserEntity}    from 'entity/user';

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

-----

## .registerEntity(reference)

Register an entity with the EntityManager.

**Note:** This method works on the fly. However, it's probably best to register your entities at bootstrap time.

### Parameters

| Parameter | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| reference | Entity | Entity reference to register |

### Returns

Itself to allow chaining.

### Examples

```js
import {inject}        from 'aurelia-framework';
import {EntityManager} from 'aurelia-orm';
import {UserEntity}    from 'entity/user';

@inject(EntityManager)
export class SomeViewModel {
  constructor (entityManager) {
    entityManager.registerEntity(UserEntity);
  }
}
```

-----

## .registerEntities(reference[])

Register an entity with the EntityManager for every item in the reference[] array.

### Parameters

| Parameter   | Type     | Description                            |
| ----------- | -------- | -------------------------------------- |
| reference[] | Entity[] | Array of Entity references to register |

### Returns

Itself to allow chaining.

### Examples

```js
import {inject}         from 'aurelia-framework';
import {EntityManager}  from 'aurelia-orm';
import {UserEntity}     from 'entity/user';
import {CategoryEntity} from 'entity/category';

@inject(EntityManager)
export class SomeViewModel {
  constructor (entityManager) {
    entityManager.registerEntities([UserEntity, CategoryEntity]);
  }
}
```
