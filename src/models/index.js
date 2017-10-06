import { observe } from 'mobx';

import Data from './data';

export default loadAndWatch('data', new Data());


function loadAndWatch(key, store) {
  let saveId = null;

  try {
    store.load(JSON.parse(localStorage.getItem(key)));
  } catch (e) {
    console.log(e);
  }

  observe(store, save);
  observe(store, 'total', save);

  return store;

  function save() {
    clearTimeout(saveId);
    saveId = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(store.serialize()));
    }, 1000);
  }
}