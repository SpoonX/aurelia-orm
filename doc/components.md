# Components

Aurelia-orm comes bundled with some (at the time of writing just one) components to simplify working with entity data.

## association-select

> The `<association-select />` component composes a `<select />` element, of which the options have been populated from an endpoint.

**Easiest example**

```html
<association-select resource="category"></association-select>
```

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

### resource

This tells the component which repository to get. This takes away the code you'd otherwise have to write with `repository.bind`.

### association

Add the association to the criteria, and listen for changes on the association so it can update when it does.

_This attribute accepts arrays, and can be combined with the `manyAssociation` attribute_.

This roughly translates to:

```js
repository.find({association: association.id});
```

### manyAssociation

Almost exactly the same as the `association` attribute, except for a `many` association. This will look up the data from the association's side.

_This attribute does **not** accept arrays, but can be combined with the `association` attribute_.

### criteria

Pass along filter criteria to the element. These will be used to restrict the data returned from the API.
