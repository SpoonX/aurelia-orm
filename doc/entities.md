# Entities
This document is a collection of snippets and examples considering entities and what they can do.

## Create
Following is a small, but more complete example of how you would implement a create. This example uses [aurelia-validation](https://github.com/aurelia/validation).

### File: entity/user-entity.js

```javascript
import {Entity, validatedResource} from 'spoonx/aurelia-orm';
import {ensure} from 'aurelia-validation';

@validatedResource('user')
export class UserEntity extends Entity {
  @ensure(it => it.isNotEmpty().containsOnlyAlpha().hasLengthBetween(3, 20))
  username = null;

  @ensure(it => it.isNotEmpty().isStrongPassword())
  password = null;

  @ensure(it => it.isNotEmpty().isEmail())
  email = null;
}
```

### File: page/user/create.js

```javascript
import {EntityManager} from 'spoonx/aurelia-orm';
import {inject} from 'aurelia-framework';

@inject(EntityManager)
export class Create {

  requestInFlight = false;

  constructor (entityManager) {
    this.entity = entityManager.getEntity('user');
  }

  create () {
    this.requestInFlight = true;

    this.entity.save()
      .then(result => {
        this.requestInFlight = false;

        console.log('User created successfully');
      })
      .catch(error => {
        console.error(error);
      });
  }
}
```

### File: page/user/create.html

```html
<template>
  <require from="component/form/user-form"></require>

  <h4 class="panel-title" t="Create user"></h4>

  <user-form
    data.bind        = "entity"
    complete.trigger = "create()"
    type             = "Create"
    working.bind     = "requestInFlight">
  </location-form>
</template>

```
