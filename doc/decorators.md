# Decorators

Aurelia-orm ships with a couple of decorators that help you configure your entities. These decorators offer functionality and convenience.

## Small example

Here's an example using (almost) all decorators available:

```js
import {Entity, resource, repository, validation, association, type} from 'aurelia-orm';
import {ensure} from 'aurelia-validation';
import {CustomRepository} from 'repository/custom-repository';

@resource('my-endpoint')
@repository(CustomRepository)
@validation()
export class Order extends Entity {
  @ensure(it => it.isNotEmpty().hasLengthBetween(3, 20))
  @type('string')
  name = null;

  // Will use string 'contact' as resource name. One-to-one.
  @association()
  contact = null

  // Will use 'lineItem' as resource name. One-to-Many
  @association('lineItem')
  lineItems = null
}
```

## @name()

Use this decorator to give your entity a name (fetched using `.getName()` on the entity). This is useful when creating dynamic components that use your entities.

```js
// Sets the name to `John Cena`
@name('John Cena')
class HelloWorld {}

// Sets the name to `i-want-bacon` if no `@name()` decorator was provided.  
@resource('i-want-bacon')
class HelloWorld {}
```

## @identifier()

This decorator comes in handy when you have the same resource name for multiple endpoints. Without it, aurelia-orm will use the resource decorator. The identifier will be used to register and retrieve the repository for the given entity.

When left empty, the name of the class (.toLowerCase()) will be used as the resource name. This is usually fine. 

> **NOTE:** Leaving the decorator without a value is bad idea for bundling, because the bundler renames your modules it will not longer match. For more information see [bundling](https://github.com/SpoonX/aurelia-orm#bundling)

```js
// Sets the identifier to "i-want-bacon"
@identifier('i-want-bacon')
class HelloWorld {}
```

## @resource()

This decorator is probably the most important one. Without it, aurelia-orm won't know what your **custom entity** is all about. The resource maps to the API endpoint it represents. Simply put, resource `foo` maps to `/foo`.

When left empty, the name of the class (.toLowerCase()) will be used as the resource name. This is usually fine but **not recommended** if you uglify/minify your sources later, because of the shortended class name.

```js
// Defaults to resource "helloworld"
@resource()
class HelloWorld {}

// Sets the resource to "i-want-bacon"
@resource('i-want-bacon')
class HelloWorld {}
```

## @idProperty()

Usually, you won't need the `@idProperty()` decorator. Orm uses 'id' as default property for the id, but you can use this decorator to define a different property as the id property.

```js
import {Entity, idProperty} from 'aurelia-orm';

@resource()
@idProperty('userId')
export class User extends Entity {}
```

## @repository()

Usually, you won't need the `@repository()` decorator. It's used to define a custom repository for your entity (which can be useful if you wish to implement different methods).

```js
import {Entity, repository} from 'aurelia-orm';
import {CustomRepository} from 'repository/custom-repository';

@repository(CustomRepository)
export class MyEntity extends Entity {}
```

## @validation()

Use this decorator if you wish to enable validation on your entity. This makes use of the StandardValidator of [aurelia-validation](https://github.com/aurelia/validation) and exposes a `.validate()` method on the entity.

```js
import {Entity, validation} from 'aurelia-orm';

@validation()
export class MyEntity extends Entity {}
```

You can also set your own validator

```js
import {Entity, validation} from 'aurelia-orm';
import {CustomValidator} from 'custom-validator';

@validation(CustomValidator)
export class MyEntity extends Entity {}
```

## @validatedResource()

Usually when making a custom entity, it's to add validation. This method simply combines @validation() and @resource() into one simple decorator. It's sugar :)

```js
import {Entity, validatedResource} from 'aurelia-orm';

@validatedResource()
export class MyEntity extends Entity {}
```

You can also set your own resource and/or validator

```js
import {Entity, validatedResource} from 'aurelia-orm';
import {CustomValidator} from 'custom-validator';

@validatedResource('i-want-bacon', CustomValidator)
export class MyEntity extends Entity {}
```

## @association()

Use this decorator to indicate that a property has a relationship with another entity and thus should be treated as an entity. This decorator has the following effects:

* It will tell aurelia-orm to populate children (nested) upon fetching data from the server.
* It will look for the property name in the server requests. Thus, make sure you use the same name here as on your server for your model.
* It will make sure that calling .asObject() on the entity recursively converts all children to simple objects.
* It will make sure that upon calling .update(), all children get converted to IDs.

### Example

```js
import {Entity, association} from 'aurelia-orm';

export class MyEntity extends Entity {
  @association()  // uses the property name to link to entity 'name'. (toOne)
  name = null;

  @association('date') // links to entity 'date'. (toOne)
  created = null;

  @association({entity: 'update'}) // links to entity 'update'. (toOne)
  update = null;

  @association({collection: 'foo'}) // links to collection of 'foo' entities.  (toMany)
  foo = false;
}
```

## @type()

This decorator allows you to add types to your properties. These types will be used **when populating an entity**, to cast the values to given type. This can be useful when, for instance, working with `Date` instances.

### Example

```js
import {Entity, type} from 'aurelia-orm';

export class MyEntity extends Entity {
  @type('string')
  name = null;

  @type('date')
  created = null;

  @type('boolean')
  disabled = false;
}
```

### Accepted types

The accepted types are:

* text
* string
* date
* datetime
* integer
* int
* number
* float
* boolean
* bool
* smart (autodetect based on value)

## @endpoint()

This decorator allows you to specify which endpoint (see the [aurelia-api documentation](https://github.com/SpoonX/aurelia-api/blob/master/doc/getting-started.md#multiple-endpoints)) to use.

When not set, the orm will use the defaultEndpoint.

### Example

An example for a User entity

```js
import {Entity, endpoint} from 'aurelia-orm';

@endpoint('auth')
export class User extends Entity {}
```

### Example

An example for a weather entity

```js
import {Entity, endpoint} from 'aurelia-orm';

@endpoint('weather')
export class Weather extends Entity {}
```

### Bonus: validation

Aurelia-orm supports aurelia-validation, and adds validation for your associations.
To add validation for associations, simply use the .hasAssociation() rule like so:

```js
import {ValidationRules} from 'aurelia-validation';
import {association, validatedResource, Entity} from 'aurelia-orm';

@validatedResource()
export class SomeEntity extends Entity {
  @association('manufacturer')
  manufacturer = null;

  constructor() {
    super();

    ValidationRules
      .ensure('manufacturer').satisfiesRule('hasAssociation')
      .on(this);  
  }
}
```
