# Configuring

Aurelia-orm uses [aurelia-api](https://github.com/SpoonX/aurelia-api) to talk to the server. By default, it will communicate with the domain you're hosting your app on. If you wish to change the endpoints used, you should take a look at [configuring aurelia-api](https://spoonx.gitbooks.io/aurelia-api-docs/content/configuration.html).

## Registering entities

Upon configuration you can register your entities. Code speaks louder than words, so here's an example:

```js
// Bulk import your entities:
import * as entities from 'config/entities';
/*  Note:
 *  This might not work with all module loaders as additional entries can be added to 'entities'.
 *  In this case, either import your entities by name or filter them using Entity.isPrototypeOf(YourEntity) === true .
 */

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()

    // Initialize validation first, if you want to use it
    // .plugin('aurelia-validation')
      
    // Register the plugin, and register your entities
    .plugin('aurelia-orm', builder => {
      builder.registerEntities(entities);
    });

  aurelia.start().then(a => a.setRoot());
}
```

Here's what your `config/entities.js` file might look like:

```js
export {User} from 'entity/user';
export {Article} from 'entity/article';
export {Category} from 'entity/category';
```
