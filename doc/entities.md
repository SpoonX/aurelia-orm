# Entities

> An instance or class of type `Entity` that defines, and holds the data of a single resource record.

Entities represent the schema of your resources. They can hold validation rules, associations, type hinting and more. In this chapter, we'll be looking at what an entity looks like, how you can create one and what they're responsible for.

## Creating

By default, aurelia-orm works with all resources, even if you don't supply a custom entity. When this happens, your entities won't have any decoration and aurelia-orm will allow all values to be set as-is.

But if you do want all these fizzy good make feel nice features, you'll want to keep on reading.

![](http://media.tumblr.com/tumblr_m8vsn5EwG61r1c47w.gif)

### The class

Creating an entity is simple.

```js
import {Entity} from 'aurelia-orm';

export class Product extends Entity {
}
```

That's it! That's all that's needed to create an entity.

### Registering

After creating your gem of an Entity, you'll want to register it with the EntityManager.
Then the Repository responsible for your resource will populate using your new entity!

Here's how:

```js
import {EntityManager} from 'aurelia-orm';
import {inject} from 'aurelia-dependency-injection';
import {Product} from './entity/product';

@inject(EntityManager)
class SomeClass {
  constructor(entityManager) {
    entityManager.registerEntity(Product);
  }
}
```

There's an easier way to do this, as described in the chapter [Configuration](configuration.html).

## Going deep

Here's an example that showcases (almost) all possibilities for your entity:

```js
import {Entity, type, association, resource} from 'aurelia-orm';
import {ValidationRules} from 'aurelia-validation';

@resource('product')
export class Product extends Entity {
  @type('string')
  name = null;

  @association('category')
  category = null;

  @association({collection: 'media'})
  media = [];

  enableValidation() {
    ValidationRules
      .ensure(a => a.name).required()
      .on(this);
  }
}
```

Further information on the decorators used are in the [decorators chapter](decorators.html).
