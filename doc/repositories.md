# Repositories

> Mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects.

A Repository allows you to retrieve entities, populate them with data and more.
It can also be extended, allowing you to supply your own custom Repository.

## Creating

By default, aurelia-orm works with all resources, even if you don't supply a custom repository. When you don't supply custom repositories, aurelia-orm will supply you with a DefaultRepository. The default repository comes bundled with the methods documented in the [Api: Repository chapter](api_repository.html).

### The class

Creating a custom Repository is simple.

```js
import {Repository} from 'aurelia-orm';

export class Custom extends Repository {
}
```

And done. At this point, the repository behaves the same as a default repository.

### Using the repository

Well, that was exciting. Now you have created your repository, it's time to use it. Repositories don't get registered with the EntityManager. In stead, they get referenced by the entities themselves. Here's an example of how to do this:

```js
import {Entity, repository} from 'aurelia-orm';
import {Custom} from 'repository/custom';

@repository(Custom)
class Product extends Entity {
}
```

And done! You can now start adding magical methods to your repository, and separate logic. Here's an example that's a bit more extended:

```js
import {Repository} from 'aurelia-orm';

export class Custom extends Repository {
  findUserPosts(user) {
    return this.find({user: user.id});
  }

  findNewPosts() {
    return this.find({read: false});
  }
}
```
