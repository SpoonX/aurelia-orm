Docs for the {`Entity`} class
=======

This class can optionally be used with validation. 
The following is a full example, with validation included.

For this example, I've made use of [aurelia-form](https://github.com/SpoonX/aurelia-form).
For docs on how to make a form, head over to that repository.

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

---------

.save()
------

Save the current state of the entity.

Will `update` if given entity was populated with data from the server, and `create` when new.

### Parameters

* None

### Returns
A new `Promise` to be resolved when `.save()` has completed.

### Examples
Here's an example on how to speak to a sails based API.

```javascript
import {UserEntity} from 'entity/user-entity';
import {inject} from 'aurelia-framework';

@inject(UserEntity)
class MyViewModel {
  constructor (entity) {
    entity.username = 'Bacon';
    entity.email    = bacon@example.org';
    entity.password = 'Super secure';

    entity.save()
      .then(result => {
        console.log('User created successfully', result);
      })
      .catch(error => {
        console.error(error);
      });
  }
}
```

---------

.asObject()
------

Returns the data in the entity as a POJO.

### Parameters

* None

### Returns
An object containing the values from the entity.

---------

.asJson()
------

Returns the data in the entity as JSON.

### Parameters

* None

### Returns
A JSON string containing the values from the entity.

---------

.enableValidation()
------

Tell the entity to apply validation to it.

### Parameters

* None

### Returns
Itself to allow chaining.

---------

.setResource(resource)
------

Tell the entity what endpoint resource it belongs to.

  ### Parameters
  
  | Parameter | Type   | Description               |
  | --------- | ------ | ------------------------- |
  | resource  | string | The name of the resource. |

### Returns
Itself to allow chaining.

---------

.setData(data)
------

Set the values of the entity.

### Parameters

| Parameter | Type   | Description                                |
| --------- | ------ | ------------------------------------------ |
| data      | object | An object of data to assign to the entity. |

### Returns
Itself to allow chaining.
