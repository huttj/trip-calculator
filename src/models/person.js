import { observable, action, computed } from 'mobx';
import autobind from 'autobind-decorator';

import Bill from './bill';

export default class Person {
  @observable name = null;
  @observable bills = [];

  constructor(name='(no name)') {
    this.name = name;
  }

  @autobind
  @action
  addBill(params) {
    this.bills = this.bills.concat(new Bill(params));
  }

  @autobind
  @action
  removeBill(bill) {
    this.bills = this.bills.filter(n => n !== bill);
  }

  @computed
  get total() {
    return this.bills.reduce((total, bill) => total + +bill.price, 0);
  }

  serialize() {
    return {
      name: this.name,
      bills: this.bills.map(n => n.serialize())
    };
  }

}
