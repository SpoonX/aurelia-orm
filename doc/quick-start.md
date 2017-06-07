# Quick start

In this document, we'll be modifying the skeleton to use aurelia-orm.

## Prerequisites

For this guide, we assume you have the [aurelia skeleton](https://github.com/aurelia/skeleton-navigation) set up.
We'll also assume you have [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed, and that you're familiar with [installing modules](https://docs.npmjs.com/).

Finally, we'll assume that you have [jspm](http://jspm.io) installed. If you don't, run `npm i -g jspm`.

## Basic usage

The getting started guide will focus on the easiest use cases imaginable. We'll replace the standard functionality provided by the skeleton with aurelia-orm.

### Installing aurelia-orm

We'll start off by installing aurelia-orm. Head over to your terminal of choice, and navigate to your skeleton.
Now run the following command:

`jspm i aurelia-orm aurelia-api`

This will install aurelia-orm and [aurelia-api](https://github.com/SpoonX/aurelia-api). Aurelia-orm uses [aurelia-api](https://github.com/SpoonX/aurelia-api) to talk to the server. By default, it will communicate with the domain you're hosting your app on. For this guide we'll be doing cross-domain communication which means we have to configure aurelia-api.

### But first...

Cool, the orm is now installed... But now we want it to _do_ something, right? Head on over to your favorite editor, open up the project and open file `src/users.js`.

As you can see, it's using `aurelia-fetch-client` to make the API calls to `https://api.github.com/`. We're going to change that, and make use of aurelia-orm.

### Configuration

This is the boring part. Head back to your editor and open up `src/main.js`. Configure aurelia-api and register `https://api.github.com/` as a new endpoint.
You can find more information on this in the [aurelia-api getting started](https://github.com/SpoonX/aurelia-api/blob/master/doc/getting-started.md#multiple-endpoints).

```javascript
import 'bootstrap';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()

    // Load the plugin, and set the base url.
    .plugin('aurelia-api', config => {
      config
        .registerEndpoint('github', 'https://api.github.com/')
        .setDefaultEndpoint('github');
    });

  aurelia.start().then(a => a.setRoot());
}
```

Here we're registering the aurelia-api plugin with aurelia. We're also configuring aurelia-api with a new endpoint.

### Use it

Now head back to `src/users.js`. Change the file to look like this:

```javascript
import {inject} from 'aurelia-framework';
import {EntityManager} from 'aurelia-orm';
import 'fetch';

@inject(EntityManager)
export class Users {
  heading = 'Github Users';
  users = [];

  constructor(entityManager) {
    this.usersRepository = entityManager.getRepository('users');
  }

  activate() {
    return this.usersRepository.find()
      .then(users => this.users = users);
  }
}
```

Here's what we've changed. We've:

1. Swapped out `HttpClient` with `EntityManager`, in both the import and inject.
2. Completely removed the config calls in the constructor. (We added that in `src/main.js` earlier).
3. Assigned something called a repository to `usersRepository` on the viewModel, by asking the `EntityManager` to give us one.
4. Changed `this.http.fetch('users')` to `this.usersRepository.find()`. Notice that we removed the `.json()` step, too.

And done! We've now successfully swapped auth aurelia-fetch-client with `aurelia-orm`.

Head back to your terminal, run `gulp watch` and open the project in your browser. Now, when you navigate to <http://localhost:9000/#/users>, you'll notice that absolutely nothing has changed; which was the point of this getting started.

## Customize it

What we've done here, is familiarize ourselves with the way to set this module up. There's a lot more this module can do to make talking to restful api's more comfortable (and organized).

### Registering entities

So far, we've only used a default entity, default repository, and only the .find() method.

```javascript
import 'bootstrap';
import * as entities from 'config/entities';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()

    // Register the plugin, and set the base url.
    .plugin('aurelia-api', builder => {
      config
        .registerEndpoint('github', 'https://api.github.com/')
        .setDefaultEndpoint('github');
    })

    // Register the plugin, and register our entities.
    .plugin('aurelia-orm', builder => {
      builder.registerEntities(entities);
    });

  aurelia.start().then(a => a.setRoot());
}
```

Here's what your `config/entities.js` file might look like:

```javascript
export {User} from 'entity/user';
export {Article} from 'entity/article';
export {Category} from 'entity/category';
```

What this does, is tell the `EntityManager` that you have built entities for your own resources.

To give you an idea, here's what the article entity might look like:

```javascript
import {Entity, validatedResource, association} from 'aurelia-orm';
import {ValidationRules} from 'aurelia-validation';

@validatedResource()
export class Article extends Entity {
  @type('string')
  name = null;

  body = null;

  @association()
  user = null;

  // Specify the name of the resource: property is called `categories`
  @association('category')
  categories = [];

  constructor() {
    super();

    ValidationRules
      .ensure('name').required().minLength(8).maxLength(20)
      .ensure('body').required()
      .ensure('user').satisfiesRule('hasAssociation')      
      .on(this);  
  }
}
```

### Use it

We can now get cracking. In any ViewModel, you can now get the desired repository, and start querying. Here's an extended example (based on the above code snippets):

```javascript
import {EntityManager} from 'aurelia-orm';
import {inject} from 'aurelia-framework';

@inject(EntityManager)
export class ViewModel {
  constructor (entityManager) {
    this.articleRepository = entityManager.getRepository('article');
    this.newArticle        = entityManager.getEntity('article');
  }

  attached (params) {
    // Find all articles that belong to category params.category.
    this.articleRepository.find({category: params.category})
      .then(articles => this.articles = articles);
  }

  create () {
    // Validate, and persist entity to the server.
    this.newArticle.validate()
      .then(validateResults => {
        if (!validateResults[0].valid) {
          throw validateResults[0];
        }
        // Validation passed, persist entity.
        return this.newArticle.save()
      })
      .catch(error => {/* Validation failed */});
  }

  destroy (index) {
    this.articles[index].destroy()
      .then(() => {
        // Display a notification?
      });
  }
}
```

### Endpoints

Every entity can be configured to use an endpoint (see [decorators](decorators.md#endpoint)).
This allows you to use the same entities, the same orm, without worrying about changing the endpoint (api url) to talk to.

### Further reading

* [Decorators](decorators.md)
* [EntityManager](api/entity-manager.md)
* [Repository](api/repository.md)
* [Entity](api/entity.md)
* [Entities](entities.md)
* [Components](components.md)

To learn more, head on over to the `doc/` directory or click the links to continue reading.

Happy hacking!
