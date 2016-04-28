# aurelia-orm

[![Build Status](https://travis-ci.org/SpoonX/aurelia-orm.svg)](https://travis-ci.org/SpoonX/aurelia-orm)
[![Known Vulnerabilities](https://snyk.io/test/npm/name/badge.svg)](https://snyk.io/test/npm/aurelia-orm)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?maxAge=2592000?style=plastic)](https://gitter.im/SpoonX/Dev)

Working with endpoints and client-side entities is unavoidable when doing API driven development. You end up writing a small wrapper for your XHRs / websocket events and putting your request methods in one place.
Another option is just using Breeze, which is large, complex and not meant for most applications. Even though your endpoints are important, you still end up neglecting them.

Enter aurelia-orm. This module provides you with some useful and cool features, such as:

* Entity definitions
* Repositories
* Associations
* Validation
* Type casting
* Self-populating select element
* And more

This makes it easier to focus on your application and organize your code.

This library is an unofficial plugin for the [Aurelia](http://www.aurelia.io/) platform.
This library plays nice with the [Sails.js framework](http://sailsjs.org).

## Important note

We've simplified installation and usage! This plugin should now be installed using `jspm i aurelia-orm` or (for webpack) `npm i aurelia-orm`. Make sure you update all references to `spoonx/aurelia-orm` and `spoonx/aurelia-api` and remove the `spoonx/` prefix (don't forget your config.js, package.json, imports and bundles).

## Installation

### Jspm/SytemJs

Run `jspm i aurelia-orm` from your project root.

### Webpack

Run `npm i aurelia-orm` from your project root.

Aurelia-orm has several submodules. So you need to add it to the AureliaWebpackPlugin includeSubModules list.

```js
AureliaWebpackPlugin({
    includeSubModules: [
      { moduleId: 'aurelia-orm' }
    ]
  }),
```

## Documentation

You can find usage examples and the documentation at [aurelia-orm-doc](http://aurelia-orm.spoonx.org/).

The [changelog](doc/changelog.md) provides you with information about important changes.

## Example

Here's a snippet to give you an idea of what this module does.

### entity/user.js

```javascript
import {Entity, validatedResource} from 'aurelia-orm';
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
import {EntityManager} from 'aurelia-orm';
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
