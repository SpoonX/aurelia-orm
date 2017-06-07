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

We've simplified installation and usage! This plugin should now be installed using `jspm i aurelia-orm` or (for webpack) `npm i aurelia-orm --save`. Make sure you update all references to `spoonx/aurelia-orm` and `spoonx/aurelia-api` and remove the `spoonx/` prefix (don't forget your config.js, package.json, imports and bundles).

## Documentation

You can find usage examples and the documentation at [aurelia-orm-doc](http://aurelia-orm.spoonx.org/).

The [changelog](doc/CHANGELOG.md) provides you with information about important changes.

## Uses

* [aurelia-api](https://www.npmjs.com/package/aurelia-api)
* `aurelia-validation@^0.12.3`

## Used by

* [aurelia-datatable](https://www.npmjs.com/package/aurelia-datatable).

## Installation

Aurelia-orm needs an installation of [aurelia-api](https://www.npmjs.com/package/aurelia-api) and `aurelia-validation@^0.12.3`.

### Aurelia-Cli

Start by following the instructions for the dependencies of orm, [aurelia-api](https://github.com/SpoonX/aurelia-api) and [aurelia-view-manager](https://github.com/SpoonX/aurelia-view-manager). When done, resume with the other steps.

Run `npm i aurelia-orm --save` from your project root.

It also has submodules and makes use of `get-prop`. So, add following to the `build.bundles.dependencies` section of `aurelia-project/aurelia.json`.

```js
"dependencies": [
  // ...
  "get-prop",
  {
    "name": "aurelia-orm",
    "path": "../node_modules/aurelia-orm/dist/amd",
    "main": "aurelia-orm",
    "resources": [
      "component/view/bootstrap/association-select.html",
      "component/view/bootstrap/paged.html"
    ]
  },
  {
    "name": "aurelia-validation",
    "path": "../node_modules/aurelia-validation/dist/amd",
    "main": "index"
  },
  // ...
],
```

### Jspm

Run `jspm i aurelia-orm npm:get-prop`

And add following to the `bundles.dist.aurelia.includes` section of `build/bundles.js`:

```js
  "get-prop",
  "aurelia-orm",
  "[aurelia-orm/**/*.js]",
  "aurelia-orm/**/*.html!text",
```

If the installation results in having forks, try resolving them by running:

```sh
jspm inspect --forks
jspm resolve --only registry:package-name@version
```

### Webpack

Run `npm i aurelia-orm --save` from your project root.

Add `aurelia-orm` in the `coreBundles.aurelia section` of your `webpack.config.js`.

### Typescript

Npm-based installations pick up the typings automatically. For Jspm-based installations, run `typings i github:spoonx/aurelia-orm` or add `"aurelia-orm": "github:spoonx/aurelia-orm",` to your `typings.json` and run `typings i`.

## Example

Here's a snippet to give you an idea of what this module does.

### entity/user.js

```javascript
import {Entity, validatedResource} from 'aurelia-orm';
import {ValidationRules} from 'aurelia-validation';

@validatedResource('user')
export class UserEntity extends Entity {
  email    = null;
  password = null;

  constructor() {
    super();

    ValidationRules
      .ensure('email').required().email()
      .ensure('password').required().minLength(8).maxLength(20)
      .on(this);  
  }
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

    this.entity.validate()
      .then(validateResults => {
        if (!validateResults[0].valid) {
          throw validateResults[0];
        }

        return this.entity.save();
      }).then(result => {
        this.requestInFlight = false;

        console.log('User created successfully');
      })
      .catch(error => {
        this.requestInFlight = false;
        // notify of the error?
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


## Known hacks

- The association-select always parses the `placeholderText` as html (`t="[html]${placeholderText}"`) due a [aurelia-i18n binding issue](https://github.com/aurelia/i18n/issues/147).
