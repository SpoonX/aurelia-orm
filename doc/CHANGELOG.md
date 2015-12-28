## 1.3.0 (2015-12-28)


#### Bug Fixes

* **watch:** Run sync, to prevent errors from race conditions ([19cc4b0c](https://github.com/SpoonX/aurelia-orm/commit/19cc4b0c0896e4384cc09a4b3fd3474a54a6ae6e))


#### Features

* **entity:**
  * Added .isNew() method ([884ec051](https://github.com/SpoonX/aurelia-orm/commit/884ec0518ab4659102e0b7636fdcadec2f961032))
  * Added .isDirty() method ([e2bb595f](https://github.com/SpoonX/aurelia-orm/commit/e2bb595f0a021f8bd3a28625cfab32175db9309f))
  * Added .isClean() method ([46b499c9](https://github.com/SpoonX/aurelia-orm/commit/46b499c9ab56303ffe0572369fa024a60cc4537d))
  * Added .markClean() method ([b333f25a](https://github.com/SpoonX/aurelia-orm/commit/b333f25a502a56e2c40e8c548de0554a2bfb6b90))


### 1.2.4 (2015-12-28)


#### Bug Fixes

* **association-select:** Remove populate criteria for many-assoc ([bc41d4ea](https://github.com/SpoonX/aurelia-orm/commit/bc41d4ea3f0bba4664ce4293d7d315caa845fe2e))


### 1.2.3 (2015-12-23)


#### Bug Fixes

* **association-select:** Return promise on load ([2cc220a5](https://github.com/SpoonX/aurelia-orm/commit/2cc220a5b39d195d9de2e10e29bb8311809a1ee4))


### 1.2.2 (2015-12-22)


#### Bug Fixes

* **association-select:** Properly load initial data ([2a952b23](https://github.com/SpoonX/aurelia-orm/commit/2a952b2344c11d3654f408ebb73f28652fcba61d))


### 1.2.1 (2015-12-22)


#### Bug Fixes

* **repository:** Faulthy return value in docblock ([58d5240f](https://github.com/SpoonX/aurelia-orm/commit/58d5240f415d66bcc6630e3e681338c946b59560))


#### Features

* **association-select:** Added a new custom element ([ab5d456f](https://github.com/SpoonX/aurelia-orm/commit/ab5d456f468b7cab92cbec6ed62dc5b03150a4e6))


## 1.2.0 (2015-12-21)


#### Features

* **repository:** Added findPath and getResource methods for flexibility. ([2f32bafd](https://github.com/SpoonX/aurelia-orm/commit/2f32bafd3eba087dcbe49b1f6f58727066c0d514))
* **validator:**
  * Add validation rule for associations to validator ([30fb1dd1](https://github.com/SpoonX/aurelia-orm/commit/30fb1dd1918d561c8ac2a99708af962224824c9e))
  * Added validation rule for associations ([350c9e31](https://github.com/SpoonX/aurelia-orm/commit/350c9e31570e616035b0e52a43b57d226c4fbd8f))


### 1.1.4 (2015-12-17)


### 1.1.3 (2015-12-16)


#### Features

* **repository:** Added support for new populated entity ([54ba6468](https://github.com/SpoonX/aurelia-orm/commit/54ba646813dcea973acd8d0603872ae92e8b01f2))


### 1.1.2 (2015-12-08)
* Added info to README

### 1.1.1 (2015-12-07)
* Reformat according to CS
* Removed unused dependency
* Removed unused imports
* Added lint to test command

### 1.1.0 (2015-12-07)
* Lazy-load validation
* Added tests for new use cases

### 1.0.0 (2015-12-04)
* Normalized api
* Added full test suite
* Added decorators for common configurations
* Added documentation

### 0.2.0 (2015-12-01)
* Added association annotation
* Added support for nested populates
* Added shallow .save() for associations
