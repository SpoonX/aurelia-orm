# Getting started
In this document, we'll be modifying the skeleton to use aurelia-orm.

## Prerequisites
For this guide, we assume you have the [aurelia skeleton](https://github.com/aurelia/skeleton-navigation) set up.
We'll also assume you have [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed, and that you're familiar with [installing modules](https://docs.npmjs.com/).

Finally, we'll assume that you have [jspm](jspm.io) installed. If you don't, run `npm i -g jspm`.

## Basic usage
The getting started guide will focus on the easiest use cases imaginable. We'll replace the standard functionality provided by the skeleton with aurelia-orm.

### Installing aurelia-orm
We'll start off by installing aurelia-orm. Head over to your terminal of choice, and navigate to your skeleton.
Now run the following command:

`jspm i github:spoonx/aurelia-orm github:spoonx/aurelia-api`

This will install aurelia-orm and [aurelia-api](https://github.com/SpoonX/aurelia-api). Aurelia-orm uses [aurelia-api](https://github.com/SpoonX/aurelia-api) to talk to the server. By default, it will communicate with the domain it's being used on. Seeing how for this guide we'll be doing cross-domain communication, we'll have to configure it, and thus we installed it.

### But first...
Cool, the orm has been installed... But now we want it to _do_ something, right? Head on over to your favorite editor, open up the project and open file `src/users.js`.

As you can see, it's using `aurelia-fetch-client` to do the API calls to `https://api.github.com/`. We're going to change that, and make use of aurelia-orm.

### Configuration
This is the boring part. Head back to your editor and open up `src/main.js`. Configure aurelia-api to use `https://api.github.com/` as the base url for our calls.

```javascript
import 'bootstrap';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()

    // Load the plugin, and set the base url.
    .plugin('spoonx/aurelia-api', builder => {
      builder.useStandardConfiguration().withBaseUrl('https://api.github.com/');
    });

  aurelia.start().then(a => a.setRoot());
}
```

All we're doing here, is telling aurelia to register aurelia-api as a plugin, and configuring aurelia-api with a baseUrl.

### Use it
Now head back to `src/users.js`. Change the file to look like this:

```javascript
import {inject} from 'aurelia-framework';
import {EntityManager} from 'spoonx/aurelia-orm';
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

Head back to your terminal, run `gulp watch` and open the project in your browser. Now, when you navigate to http://localhost:9000/#/users, you'll notice that absolutely nothing has changed; which was the point of this getting started.

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
    .plugin('spoonx/aurelia-api', builder => {
      builder.useStandardConfiguration().withBaseUrl('https://api.github.com/');
    })
    
    // Register the plugin, and register our entities.
    .plugin('spoonx/aurelia-orm', builder => {
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
import {Entity, validatedResource, association} from 'spoonx/aurelia-orm';
import {ensure} from 'aurelia-validation';

@validatedResource()
export class Article extends Entity {
  @ensure(it => it.isNotEmpty().hasLengthBetween(3, 20))
  name = null;
  
  @ensure(it => it.isNotEmpty())
  body = null;

  @association()
  user = null;
  
  // Specify the name of the resource: property is called `categories`
  @association('category')
  categories = [];
}
```

### Use it
We can now get cracking. In any ViewModel, you can now get the desired repository, and start querying. Here's an extended example (based on the above code snippets):

```javascript
import {EntityManager} from 'spoonx/aurelia-orm';
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
    this.newArticle.getValidation().validate()
      .then(result => {
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

### Further reading

* [Decorators](decorators.md)
* [EntityManager](api/entity-manager.md)
* [Repository](api/repository.md)
* [Entity](api/entity.md)
* [Entities](entities.md)
* [Components](components.md)

To learn more, head on over to the `doc/` directory or click the links to continue reading.

Happy hacking!
