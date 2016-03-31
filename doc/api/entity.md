Docs for the {`Entity`} class
=======

This class can optionally be used with validation.
The following is a full example, with validation included.

For a larger example, take a look at the end of this document.

---------

.save()
------

Save the current state of the entity.

**Note**: Will `update` if given entity was populated with data from the server, and create when new. To force an update, use [.update()](#update).

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
    entity.email    = 'bacon@example.org';
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

.isDirty()
------

Returns if the properties of the entity have changed since fetching it.

### Parameters

* None

### Returns
Boolean indicating if the entity is dirty.

---------

.isClean()
------

Returns if the properties of the entity haven't changed since fetching it.

### Parameters

* None

### Returns
Boolean indicating if the entity is clean.

---------

.isNew()
------

Returns if the entity is new (e.g. hasn't been persisted to the server).
This essentially checks if the entity has an `id` set.

### Parameters

* None

### Returns
Boolean indicating if the entity is new.pa

---------

.update()
------

Save the current state of the entity.

**Note:** Use this method if you want to prevent the module from **creating a new record** and wish to force an **update**. Use [.save()](#save) to create a new record.

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
    entity.email    = 'bacon@example.org';
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

.destroy()
------

Delete the entity server-side.

### Parameters

* None

### Returns
A new `Promise` to be resolved when `.destroy()` has completed.

### Examples

```javascript
import {inject}        from 'aurelia-framework';
import {EntityManager} from 'aurelia-orm';

@inject(EntityManager)
export class SomeViewModel {
  constructor (entityManager) {
    let repository = entityManager.getRepository('user');

    // Find a single record.
    repository.find(7)
      .then(entity => {
        return entity.destroy()
      })
      .then(() => console.log('All done!'))
      .catch(console.error);
  }
}
```

---------

.asObject()
------

Returns the data in the entity as a POJO.

**Note:** This method also calls `.asObject()` on all of its associations, if any.

### Parameters

* None

### Returns
An object containing the values from the entity.

---------

.asJson()
------

Returns the data in the entity as JSON.

**Note:** This method uses `.asObject()` and for that reason also works with associations.

### Parameters

* None

### Returns
A JSON string containing the values from the entity.

---------

.hasValidation()
------

Check if entity has validation enabled.

### Parameters

* None

### Returns
A boolean indicating if validation is enabled or not.

---------

.getValidation()
------

When enabled, this method returns the validation instance.

### Parameters

* None

### Returns
An instance of [aurelia-validation](https://github.com/aurelia/validation).

---------

.setResource(resource)
------

Tell the entity what endpoint resource it belongs to. This method is useful if you don't feel like using the decorators.

### Parameters

| Parameter | Type   | Description               |
| --------- | ------ | ------------------------- |
| resource  | string | The name of the resource. |

### Returns
Itself to allow chaining.

---------

.getResource()
------

Get the resource this entity belongs to.

**Note:** Also works when called statically on custom entities.

### Parameters

* None

### Returns
The resource it belongs to (string).

---------

.getName()
------

Get the name of this entity.

**Note:** Also works when called statically on custom entities.

### Parameters

* None

### Returns
The name of the entity when configured using the `@name` decorator.
Defaults to the resource name (or null when also not set).

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

For this example, I've made use of [aurelia-form](https://github.com/SpoonX/aurelia-form).
For docs on how to make a form, head over to that repository.
