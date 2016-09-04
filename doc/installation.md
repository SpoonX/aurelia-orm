# Installation

Aurelia-orm needs an installation of [aurelia-api](https://www.npmjs.com/package/aurelia-api) and `aurelia-validation@0.6.6`.

## Aureli-Cli

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
      "component/association-select.html",
      "component/paged.html"
    ]
  },
  {
    "name": "aurelia-validation",
    "path": "../node_modules/aurelia-validation/dist/amd",
    "main": "aurelia-validation"
  },
  // ...
],
```

## Jspm

Run `jspm i aurelia-orm npm:get-prop`

And add following to the `bundles.dist.aurelia.includes` section of `build/bundles.js`:

```js
  "get-prop",
  "aurelia-datatable",
  "[aurelia-datatable/**/*.js]",
  "aurelia-datatable/**/*.html!text",
```

If the installation results in having forks, try resolving them by running:

```sh
jspm inspect --forks
jspm resolve --only registry:package-name@version
```

## Webpack

Run `npm i aurelia-orm --save` from your project root.

Add `aurelia-orm` in the `coreBundles.aurelia section` of your `webpack.config.js`.

## Typescript

Npm-based installations pick up the typings automatically. For Jspm-based installations, run `typings i github:spoonx/aurelia-orm` or add `"aurelia-orm": "github:spoonx/aurelia-orm",` to your `typings.json` and run `typings i`.
