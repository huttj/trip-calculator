import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import Data from '../models';
import { colors } from '../constants';
import {withRouter} from 'react-router-dom';

@withRouter
@observer
class AddPerson extends Component {

  componentWillMount() {
    this.setState({ name: '' });
  }

  componentDidMount() {
    this.input && this.input.focus();
  }

  @autobind
  update(e) {
    this.setState({ name: e.target.value });
  }

  @autobind
  create(e) {
    e.preventDefault();
    const { name } = this.state;

    if (!name.trim()) {
      return;
    }

    try {

      Data.addPerson(name);
      this.setState({ name: '' });
      this.input && this.input.focus();

    } catch (e) {
      Data.addModal({
        title: "Already added",
        body: (
          <div>
            <p>You've already added <span style={{ fontStyle: 'italic' }}>{name}</span>.</p>
            <p>Are there two people in your group with that name? Add their last name.</p>
          </div>
        )
      });
    }
  }

  render() {

    const disabled = !this.state.name.trim();

    return (
      <div style={{ margin: 16, textAlign: 'center' }}>

        <h1 style={{ fontWeight: 300 }}>Add a Person</h1>

        <form onSubmit={this.create}>
          <input
            style={{
              fontSize: 24,
              padding: 6,
              borderRadius: 4,
              border: '1px solid rgba(0,0,0,.125)',
              fontWeight: 300
            }}
            type="text"
            placeholder="Name"
            onChange={this.update}
            value={this.state.name}
            ref={ref => this.input = ref}
          />

          <button
            style={{
              display: 'block',
              backgroundColor: disabled ? colors.light : colors.primary,
              margin: '16px auto',
              border: 'none',
              color: disabled ? colors.dark : 'white',
              padding: '10px 16px',
              fontSize: 24,
              borderRadius: 4
            }}
            disabled={disabled}
          >Add</button>

        </form>

      </div>
    );
  }
}

export default AddPerson;
