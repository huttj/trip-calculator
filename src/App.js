import React, {Component} from 'react';
import {
  HashRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom'
import {observer} from 'mobx-react';

import AddPerson from './components/addPerson';
import Person from './components/person';
import Menu from './components/menu';
import ModalContainer from './components/modal';
import Main from './components/main';

import Data from './models';

@observer
class App extends Component {

  componentDidMount() {
    window.addEventListener('resize', this.update);
    window.addEventListener('keyup', this.keyup);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.update);
    window.removeEventListener('keyup', this.keyup);
  }

  update() {
    this.width = window.outerWidth;
    if (this.timeout) return;

    this.timeout = setTimeout(()=> {
      Data.windowWidth = window.outerWidth;
      console.log('resizing', Data.windowWidth);
      this.timeout = null;
    }, 500);
  }

  keyup(e) {
    const modal = Data.modals[0];

    if (modal) {


      if (e.which === 13) {

        if (modal.ok) modal.ok();

        Data.dismissModal(modal);
        e.preventDefault();
        e.stopPropagation();

      } else if (e.which === 27) {
        if (modal.cancel) modal.cancel();
        Data.dismissModal(modal);
        e.preventDefault();
        e.stopPropagation();

      }
    }
  }

  render() {

    const isSmall = Data.isSmall;

    let menuButton = null;
    if (isSmall) {
      menuButton = (
        <div
          style={{
            position: 'absolute',
            padding: '4px 6px',
            cursor: 'pointer',
            transform: 'rotate(90deg) scale(1.25,8) translate3d(5px,-6px,0)',
          }}
          onClick={e => {
            Data.showMenu = true;
            e.stopPropagation();
          }}
        >
          ...
        </div>
      );
    }

    return (
      <Router>
        <div style={{display: 'flex', flexDirection: 'row' }}>

          { !isSmall || Data.showMenu ? <Menu style={{
            position: isSmall ? 'fixed' : 'relative',
            width: isSmall ? '90vw' : 'auto',
            flex: 1,
            maxWidth: 300,
            zIndex: 100
          }}/> : null }

          <div style={{ flex: 1, maxWidth: 1024, margin: '0 auto' }}>

            { menuButton }

            <Route exact path="/" component={Main} />
            <Route path="/add-person" component={AddPerson} />
            <Route path="/person/:name" component={Person} />

            { isSmall && Data.showMenu ? <div onClick={()=>{Data.showMenu = false}} style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0,.5)', top: 0, bottom: 0, left: 0, right: 0 }}/> : null }

          </div>

          <ModalContainer style={{ zIndex: 1000 }}/>

        </div>
      </Router>
    );
  }
}

export default App;
