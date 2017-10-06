import React, {Component} from 'react';
import autobind from 'autobind-decorator';
import {Link, withRouter} from 'react-router-dom';

import {observer} from 'mobx-react';
import Data from '../models';

import {colors} from '../constants';

@withRouter
@observer
class App extends Component {

  @autobind
  goHome() {
    this.props.history.push('/');
  }

  @autobind
  makePerson(person) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,0,0,.125)',
          padding: '12px',
          backgroundColor: 'white',
          cursor: 'pointer'
        }}
        onClick={() => this.props.history.push('/person/' + person.name)}
      >
        <p style={{margin: 0, fontSize: 18, flex: 1, color: colors.primary}}>{person.name}</p>
        <p style={{margin: 0, fontSize: 18, flex: 1, textAlign: 'right'}}>${person.total || 0}</p>
      </div>
    );
  }

  render() {

    const isSmall = Data.windowWidth < 1000;

    let hideButton = null;

    if (isSmall) {
      hideButton = (
        <span
          style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0 2px',
            fontSize: 24,
            margin: 0,
            cursor: 'pointer',
            transform: 'scale3d(.6, 1.33, 1)',
          }}
          onClick={() => Data.showMenu = false}
        >{'<'}</span>
      );
    }

    return (
      <div style={{position: 'relative', height: '100vh', ...this.props.style}} onClick={()=>Data.showMenu = false}>
        <div style={{
          boxShadow: '1px 0 rgba(0,0,0,.125)',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          position: 'absolute',
          backgroundColor: colors.light
        }}>

          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 12px 12px 6px',
            backgroundColor: colors.primary,
            color: 'white'
          }}>
            { hideButton }
            <h2 style={{flex: 1, fontWeight: '100', margin: 0, paddingLeft: 6 }}>People</h2>
            <Link to="/add-person" style={{color: 'white', textDecoration: 'none'}}>
              <span style={{padding: 0, fontSize: 24, margin: 0, cursor: 'pointer'}}>+</span>
            </Link>
          </div>

          { Data.people.map(this.makePerson) }

          <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000}}>
            <p style={{textAlign: 'center', color: colors.primary, cursor: 'pointer'}} onClick={this.goHome}>Help</p>
          </div>

        </div>

      </div>
    );
  }
}

export default App;
