# Entity manager

> Manages Repository and Entity instances for resources.

The EntityManager has a special job: it links entities, repositories and resources together.
When you want to start working with a resource, you ask the EntityManager to give you what you need.

## Create new record

Want to create a new record? Easy:

```js
import {inject}        from 'aurelia-framework';
import {EntityManager} from 'aurelia-orm';

@inject(EntityManager)
export class SomeViewModel {
  constructor (entityManager) {
    let entity = entityManager.getEntity('user');

    // Note: You could also do `user.username='';`. `.setData()` is optional.
    entity.setData({username: 'Bob', password: 'Burger'}).save()
      .then(result => {
        console.log('Created a new user!');
      });
  }
}
```

## Fetch records

Want to fetch records? Also easy:

```js
import {inject}        from 'aurelia-framework';
import {EntityManager} from 'aurelia-orm';

@inject(EntityManager)
export class SomeViewModel {
  constructor (entityManager) {
    let repository = entityManager.getRepository('user');

    repository.find({username: 'bob'})
      .then(result => {
        console.log('Found User!', result);
      });
  }
}
```
