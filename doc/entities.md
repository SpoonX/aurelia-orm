
## Example
Following is a small, but more complete example of how you would implement a create.

### File: entity/user-entity.js

  ```javascript
import {Entity} from 'spoonx/aurelia-orm';
import {ensure} from 'aurelia-validation';

export class UserEntity extends Entity {
  constructor () {
    super(...arguments);

    // Set the endpoint resource to link this entity to and enable validation.
    this.setResource('user').enableValidation();
  }

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
import {UserEntity} from 'entity/user-entity';
import {inject} from 'aurelia-framework';

@inject(UserEntity)
export class Create {

  requestInFlight = false;

  constructor (UserEntity) {
    this.entity = UserEntity;
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
