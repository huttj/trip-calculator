import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import Data from '../models';
import { colors } from '../constants';
import {withRouter} from 'react-router-dom';

@withRouter
@observer
class AddPerson extends Component {

  render() {
    return (
      <div style={{ margin: 16 }}>

        <h1 style={{ fontWeight: 300, textAlign: 'center' }}>Trip Calculator</h1>

        <p>Welcome to the Trip Calculator app.</p>

        <p>This app helps friends and coworkers split the costs of a trip, fairly and easily.</p>

        <h3>How to use:</h3>

        <ol>
          <li style={{ marginBottom: 6 }}>Add people to the app with the add button on the top of the menu.</li>
          <li style={{ marginBottom: 6 }}>Click a person's name to go to their page, and add expenses for each person.</li>
          <li style={{ marginBottom: 6 }}>Review the balance section on each person's page to see what everyone owes or is owed.</li>
        </ol>

      </div>
    );
  }
}

export default AddPerson;
