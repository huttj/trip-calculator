import { observable, action } from 'mobx';

export default class Bill {
  @observable name = 'Untitled';
  @observable price = 0;
  @observable description = '';

  constructor({ name='(no name)', price=0, description='' }={}) {
    this.name = name;
    this.price = price;
    this.description = description;
  }

  serialize() {
    return {
      name: this.name,
      price: this.price,
      description: this.description,
    };
  }

}
