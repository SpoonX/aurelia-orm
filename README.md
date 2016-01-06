# aurelia-orm

[![Build Status](https://travis-ci.org/SpoonX/aurelia-orm.svg)](https://travis-ci.org/SpoonX/aurelia-orm)
[![Known Vulnerabilities](https://snyk.io/test/npm/name/badge.svg)](https://snyk.io/test/npm/name)
[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> Makes working with entities and calling your Rest API simple.

This library is an unofficial plugin for the [Aurelia](http://www.aurelia.io/) platform.
This library plays nice with the [Sails.js framework](http://sailsjs.org).

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.durandal.io/). If you have questions, we invite you to [join us on Gitter](https://gitter.im/aurelia/discuss). If you would like to have deeper insight into our development process, please install the [ZenHub](https://zenhub.io) Chrome Extension and visit any of our repository's boards. You can get an overview of all Aurelia work by visiting [the framework board](https://github.com/aurelia/framework#boards).

## Polyfills

* None

## Used By

This library is used directly by applications only.

## Platform Support

This library can be used in the **browser** only.

## Installation
Installing this module is fairly simple.

Run `jspm install github:spoonx/aurelia-orm` from your project root.

## Example
Here's a snippet to give you an idea of what this module does.

### entity/user.js
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

### page/some-view-model.js
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

## Gotchas
When using this module, please keep in mind the following gotchas.

### Bundling
When bundling your aurelia app, the bundler renames your modules (to save space).
This is fine, but aurelia-orm allows you to add decorators without values, and uses the module name to set the value.
For instance, `@resource()` would use the module's name to set the resource.

So keep in mind: When using aurelia-orm in a bundled application, you must specify a value for your decorators.
For instance, `@decorator('category')`.

## Documentation
You can find usage examples and documentation in the [Getting started](doc/getting-started.md) or the `doc/` directory.
