```javascript
import {inject}        from 'aurelia-framework';
import {EntityManager} from 'spoonx/aurelia-orm';
import UserEntity      from 'entity/user';

@inject(EntityManager)
export class SomeUpdateViewModel {
  constructor (entityManager) {
    this.repository = entityManager.getRepository(UserEntity);
  }

  activate (params) {
    return this.repository.find(params.id)
      .then(result => {
        this.entity = result;
      })
      .catch(console.error);
  }

  update () {
    this.entity.save()
      .then(result => {
        this.notification.success('User updated successfully', result);
      })
      .catch(error => {
        console.error(error);
      });
  }
}
```
