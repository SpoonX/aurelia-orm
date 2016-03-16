# Decorators

Aurelia-orm ships with a couple of decorators that help you configure your entities.

## Small example

Here's an example using (almost) all decorators available:
 

```javascript
import {Entity, resource, repository, validation, association} from 'spoonx/aurelia-orm';
import {ensure} from 'aurelia-validation';
import {CustomRepository} from 'repository/custom-repository';

@resource('my-endpoint')
@repository(CustomRepository)
validation()
export class MyEntity extends Entity {
  @ensure(it => it.isNotEmpty().hasLengthBetween(3, 20))
  name = null;
  
  // Will use string 'onetoone' as resource name.
  @association()
  oneToOne = null
  
  // Will use 'multiple' as resource name.
  @association('multiple')
  oneManyToMany = null
}
```

## @name()

Use this decorator to give your entity a name (fetched using `.getName()` on the entity). This is useful when creating dynamic components that use your entities.

```javascript
// Sets the name to `John Cena`
@name('John Cena')
class HelloWorld {}

// Sets the name to `i-want-bacon` if no `@name()` decorator was provided.  
@resource('i-want-bacon')
class HelloWorld {}
```

## @resource()

This decorator is probably the most important one. Without it, aurelia-orm won't know what your **custom entity** is all about. The resource maps to the API endpoint it represents. Simply put, resouce `foo` maps to `/foo`.

When left empty, the name of the class (.toLowerCase()) will be used as the resource name. This is usually fine.

```javascript
// Defaults to resource "helloworld"
@resource()
class HelloWorld {}

// Sets the resource to "i-want-bacon"
@resource('i-want-bacon')
class HelloWorld {}
```

## @repository()

Usually, you won't need the `@repository()` decorator. It's used to define a custom repository for your entity (which can be useful if you wish to implement different methods).

```javascript
import {Entity, repository} from 'spoonx/aurelia-orm';
import {CustomRepository} from 'repository/custom-repository';

@repository(CustomRepository)
export class MyEntity extends Entity {}
```

## @validation()

Use this decorator if you wish to enable validation on your entity. This makes use of [aurelia-validation](https://github.com/aurelia/validation) and exposes a `.getValidation()` method on the entity.

## @validatedResource()

Usually when making a custom entity, it's to add validation. This method simply combines @validation() and @resource() into one simple decorator. It's sugar :)

## @association()

Use this decorator to indicate that a property has a relationship with another entity and thus should be treated as an entity. This decorator has the following effects:

* It will tell aurelia-orm to populate children (nested) upon fetching data from the server.
* It will make sure that calling .asObject() on the entity recursively converts all children to simple objects.
* It will make sure that upon calling .update(), all children get converted to IDs.

## @type()

This decorator allows you to add types to your properties. These types will be used **when populating an entity**, to cast the values to given type. This can be useful when, for instance, working with `Date` instances.

### Example

```javascript
import {Entity, type} from 'spoonx/aurelia-orm';

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

```javascript
import {Entity, endpoint} from 'spoonx/aurelia-orm';

@endpoint('auth')
export class User extends Entity {}
```

### Example

An example for a weather entity

```javascript
import {Entity, endpoint} from 'spoonx/aurelia-orm';

@endpoint('weather')
export class Weather extends Entity {}
```

### Bonus: validation

Aurelia-orm extends aurelia-validate, and adds validation for your associations.
To add validation for associations, simply use the .hasAssociation() rule like so:

```javascript
import {ensure} from 'aurelia-validation';
import {association, validatedResource, Entity} from 'spoonx/aurelia-orm';

validatedResource()
export class SomeEntity extends Entity {
  @association('manufacturer')
  @ensure(it => it.hasAssociation())
  manufacturer = null;
}
```
