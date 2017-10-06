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
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.update);
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

  render() {

    const isSmall = Data.isSmall;

    let menuButton = null;
    if (isSmall) {
      menuButton = (
        <div
          style={{
            position: 'fixed',
            padding: '4px 6px',
            cursor: 'pointer',
            transform: 'rotate(90deg) scale(1.25,8) translate3d(5px,-6px,0)',
          }}
          onClick={()=>Data.showMenu = true}
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

          </div>

          <ModalContainer style={{ zIndex: 1000 }}/>

        </div>
      </Router>
    );
  }
}

export default App;
