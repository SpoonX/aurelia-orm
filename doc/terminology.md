# Terminology

To help you understand the contents of the documentation, it helps to know what we mean when we say certain things. This chapter lists and details the terminology used throughout this book.

## Resource

> The name of a resource located at the API.

Some examples of resources are: `user`, `category` and `product`. Each resource has an associated `Entity` and `Repository`.

## Entity

> An instance or class of type `Entity` that defines, and holds the data of a single resource record.

An entity defines what a record looks like. Which properties it has and which validations apply.

## Collection

> An array of entities.

A collection is a simple javascript array containing one or more entity instances.

## Repository

> Mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects.

The repository handles the logic, and returns entity instances. Some ORMs put this logic on the entity and call them "models". An example of such a method is:

```js
  repository.findBySomething(specialCriteria).then(result => doSomethingWithTheResponse)
```

In summary: all fetch methods and response mutations belong in a repository.

## Association

> The relationship between two or more entities.

Some entities have a relationship with each other. For instance, entity `User` has many `groups` of type `Group`. The term for this is `collection association`.

## Entity manager

> Manages Repository and Entity instances for resources.

Each resource has an entity, and a repository. They are all registered with the entity manager.

## Populate

> To build up an instance with the provided data.

Entities can be populated with data. This means they get data assigned to them.
