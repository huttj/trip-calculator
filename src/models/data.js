import { observable, action, computed } from 'mobx';
import autobind from 'autobind-decorator';

import Person from './person';

export default class Data {
  @observable people = [];
  @observable modals = [];
  @observable windowWidth = window.outerWidth;
  @observable showMenu = false;

  @computed get isSmall() {
    return this.windowWidth <= 900;
  }

  findPersonByName(name) {
    return this.people.find(n => n.name === name);
  }

  @computed
  get total() {
    return this.people.reduce((total, person) => total + person.total, 0);
  }

  @computed
  get share() {
    return this.total / this.people.length;
  }

  @action addPerson(name) {

    if (!name) {
      throw new Error('Must provide a name');
    }

    if (this.people.find(p => p.name.trim() === name.trim())) {
      throw new Error('You have already added ' + name + '.');
    }

    const person = new Person(name);
    this.people = this.people.concat(person);
    return person;
  }

  @action removePerson(person) {
    this.people = this.people.filter(n => n !== person);
  }

  @autobind
  @action
  addModal({ title, body, message, ok, cancel, okText, cancelText, danger }) {

    const id = Math.random() * 1E10 | 0;

    const modal = { id, title, body, message, okText, cancelText, danger };

    if (ok) {
      modal.ok = () => {
        console.log('ok', this.modals[0]);
        ok();
        this.removeModal(modal);
        console.log('ok', this.modals[0]);
      };
    }

    if (cancel) {
      modal.cancel = () => {
        cancel();
        this.removeModal(modal);
      };
    }

    this.modals = this.modals.concat(modal);
  }

  @action removeModal(modal) {
    this.modals = this.modals.filter(n => n.id !== modal.id);
  }

  @action dismissModal(modal) {
    if (modal.cancel) modal.cancel();
    this.removeModal(modal);
  }

  serialize() {
    return {
      people: this.people.map(n => n.serialize())
    };
  }

  load(data) {
    try {

      this.people = data.people.map(p => {
        const person = new Person(p.name);
        p.bills.forEach(b => person.addBill(b));
        return person;
      });

    } catch (e) {
      console.warn(e);
    }
  }
}

function noop(){}