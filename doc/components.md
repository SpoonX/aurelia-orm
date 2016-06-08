# Components
Aurelia-orm comes bundled with some components to simplify working with entity data.

## association-select
> The `<association-select />` component composes a `<select />` element, of which the options have been populated from an endpoint.

**Basic example**

```html
<association-select
  value.bind="data.author"
  repository.bind="userRepository"
></association-select>
```

**Extended example**

```html
<!-- First, populate a list of categories -->
<association-select
  value.bind="data.category.id"
  repository.bind="categoryRepository"
></association-select>

<!-- Then populate a list of pages -->
<association-select
  value.bind="data.page.id"
  repository.bind="pageRepository"
></association-select>

<!-- Then populate a list of groups -->
<association-select
  value.bind="data.group.id"
  repository.bind="groupRepository"
></association-select>

<!-- And finally, populate a list of authors based on the previous selects -->
<association-select
  value.bind="data.author.id"
  repository.bind="userRepository"
  property="username"
  association="[data.page, data.group]"
  manyAssociation="data.category"
  criteria="{age:{'>':18}}"
></association-select>
```

Following are all attributes, and how they work.

### value
This is the selected value of the element. This functions the same as a regular `<select />` would.

### property
This tells the component which property to use from the data sent back by the resource (using the repository). **Defaults to `name`**.

### repository
This tells the component where it can find the data to populate the element. This is a simple `EntityManager.getRepository('resource')`.

### association
Add the association to the criteria, and listen for changes on the association so it can update when it does.

*This attribute accepts arrays, and can be combined with the `manyAssociation` attribute*.

This roughly translates to:

```js
repository.find({association: association.id});
```

### manyAssociation
Almost exactly the same as the `association` attribute, except for a `many` association. This will look up the data from the association's side. 

_This attribute does **not** accept arrays, but can be combined with the `association` attribute_.

### criteria
Pass along filter criteria to the element. These will be used to restrict the data returned from the API.

## Paged
Paged component for aurelia. Allows you to display paged information.

### resource
A repository, simple `EntityManager.getRepository('resource')`.

### criteria (optional)
Parameter gets passed straight to the query field of `.find()`.

### limit (optional)
This will determine the amount of items to fetch, default is 30.

### page (optional)
Which page to load.

### Example:

```html
<paged resource.bind="userRepository" limit.bind="30" data.bind="data">

  <div class="user" repeat.for="user of data">
    ${user.id} - ${user.name}
  </div>

</paged>
```
