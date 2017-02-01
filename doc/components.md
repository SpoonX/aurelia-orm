# Components
Aurelia-orm comes bundled with some components to simplify working with entity data.

## association-select

> The `<association-select />` component composes a `<select />` element, of which the options have been populated from an endpoint. The selects value is the 'id' property and the displayed textContents are the 'name' properties of the resource. You can change the textContent by setting the property attribute of the association-select.

## Easiest example

Get all entries of the resource 'category' and populate the select using the 'id' and the 'name' properties of your resource for the value and the textContent respectively.

```html
<association-select resource="category"></association-select>
```

## Basic example

Get all entries of the view-models 'userRepository' repository property and populate the select using the 'id' and the 'fullName' properties of your resource for the value and the textContent respectively. The selects current value is two-way bound to the 'data.author' property of your view-model.

```html
<association-select
  property="fullName"
  value.bind="data.author"
  repository.bind="userRepository"
></association-select>
```

## Extended example

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
<!-- With custom selectable placeholder (value===0)                        -->
<association-select
  value.bind="data.author.id"
  error.bind="error"
  repository.bind="userRepository"
  property="username"
  association.bind="[data.page, data.group]"
  many-association.bind="data.category"
  criteria.bind='{where:{age:{">":18}}}'
  selectable-placeholder="true"
  placeholder-text="- Any -"
  if.bind="!error"
></association-select>

<div class="alert alert-warning" if.bind="!!error">
  Server error:${error.statusText}
</div>
```

Following are all attributes, and how they work.

### value.bind
This is the selected value of the element. This functions the same as a regular `<select />` would.

### error.bind
That's where a server response error would be stored.

### identifier
This tells the component which property to use from the select's value. **Defaults to `id`**.

### property
This tells the component which property to use from the data sent back by the resource (using the repository). **Defaults to `name`**.

### resource
This tells the component where it can find the data to populate the element. This is a simple `EntityManager.getRepository('resource')`. This takes away the code you'd otherwise have to write with `repository.bind`.

### repository.bind
This tells the component which repository to get.

### association.bind
Add the association to the criteria, and listen for changes on the association so it can update when it does.

*This attribute accepts arrays, and can be combined with the `manyAssociation` attribute*.

This roughly translates to:

```js
repository.find({association: association.id});
```

### many-association.bind
Almost exactly the same as the `association` attribute, except for a `many` association. This will look up the data from the association's side.

_This attribute does **not** accept arrays, but can be combined with the `association` attribute_.

**Note:** When using `many-association.bind` on an entity that has multiple relations with the same resource, use the following format:

```html
<association-select
  many-association.bind="{entity: data.category, property: 'categories'}"
></association-select>
```

The `property` is the property name of the association on the parent entity.

### multiple
This sets the component to a multi-select. **Defaults to `false`**.

### criteria.bind
Pass along filter criteria (as JSON or Object) to the element. These will be used to restrict the data returned from the API.

### hide-placeholder
By default, the select-association will include an option with `value===0`, and text "- Select a value -". Adding this attribute will _exclude_ the placeholder (`value===0`) option from the select. **Defaults to `false`**.

```html
<association-select
  property="fullName"
  value.bind="data.author"
  repository.bind="userRepository"
  hide-placeholder="true"
></association-select>
```

### selectable-placeholder
By default, the placeholder (`value===0`) option will be `disabled`, i.e. not selectable. Adding this attribute will allow the placeholder option to be selectable. **Defaults to `false`**.

```html
<association-select
  property="fullName"
  value.bind="data.author"
  repository.bind="userRepository"
  selectable-placeholder="true"
></association-select>
```

### placeholder-text
By default, the placeholder (`value===0`) option will have a text value of "_- Select a value -_". Setting this attribute will allow custom text to be added to the placeholder option.

```html
<association-select
  property="fullName"
  value.bind="data.author"
  repository.bind="userRepository"
  placeholder-text="- Assign to User -"
></association-select>
```

## paged
Paged component for aurelia-orm. Allows you to display information paged.

### resource
This tells the component where it can find the data to populate the element. This is a simple `EntityManager.getRepository('resource')`. This takes away the code you'd otherwise have to write with `repository.bind`.

### repository.bind
This tells the component which repository to get.

### data.bind
That's where the fetched data houses.

### error.bind
That's where a server response error would be stored.

### criteria
Pass along filter criteria (as JSON or Object) to the element. These will be used to restrict the data returned from the API.

### limit
This will determine the amount of items to fetch, default is 30.

### page
Which page to load.

### Example:

```html
<paged resource="user" limit="30" data.bind="data" criteria.bind='{where:{age:{">":18}}}' error.bind="error">

  <div class="user" repeat.for="user of data" if.bind="!error">
    ${user.id} - ${user.name}
  </div>

  <div class="alert alert-warning" if.bind="!!error">
    Server error:${error.statusText}
  </div>
</paged>
```
