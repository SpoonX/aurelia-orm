# Installing

Install aurelia-orm and [aurelia-api](https://github.com/SpoonX/aurelia-api).

## Jspm/SytemJs

Run `jspm i aurelia-api aurelia-orm` from your project root.

## Webpack

Run `npm i aureia-api aurelia-orm --save` from your project root.

Aurelia-orm has several submodules. So you need to add it to the AureliaWebpackPlugin includeSubModules list.

```js
AureliaWebpackPlugin({
    includeSubModules: [
      { moduleId: 'aurelia-orm' }
    ]
  }),
```
