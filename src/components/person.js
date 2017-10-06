import React, {Component} from 'react';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import Data from '../models';
import {colors} from '../constants';
import {withRouter} from 'react-router-dom';

@observer
class Person extends Component {

  loadPerson(props = this.props) {
    const {name} = props.match.params;
    const person = Data.findPersonByName(name);
    this.setState({
      person,
      name: '',
      price: '',
      description: ''
    });
  }

  componentWillMount() {
    this.loadPerson();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.match.params.name !== this.props.match.params.name) {
      this.loadPerson(newProps);
    }
  }

  componentDidMount() {
    this.input && this.input.focus();
  }

  @autobind
  removePerson() {
    Data.addModal({
      title: 'Remove Person',
      message: 'Really remove ' + this.state.person.name + '? This cannot be undone.',
      danger: true,
      ok: () => {
        Data.removePerson(this.state.person);
        this.props.history.replace('/');
      }
    })
  }

  @autobind
  addBill(e) {
    e.preventDefault();
    if (!this.state.name.trim()) {
      Data.addModal({
        title: 'Name required',
        message: 'Please add a name for this expense'
      });
    } else if (!this.state.price.trim()) {

      Data.addModal({
        title: 'Price required',
        message: 'Please add a price for this expense'
      });

    } else {
      this.state.person.addBill(this.state);
      this.setState({
        name: '',
        price: '',
        description: ''
      });
      this.input.focus();
    }
  }

  @autobind
  removeBill(bill) {
    Data.addModal({
      title: 'Remove bill?',
      message: `Really remove ${bill.name || 'this bill'}?`,
      ok: () => this.state.person.removeBill(bill),
      danger: true
    })
  }

  update(name) {
    return ({target: {value}}) => this.setState({[name]: value});
  }

  @autobind
  makeBill(bill, i) {
    const isSmall = Data.isSmall;

    if (isSmall) {

      return (
        <div>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <p>{bill.name}</p>
            <p>${bill.price}</p>
            <p style={{
              display: 'inline',
              padding: '8px 14px',
              backgroundColor: colors.danger,
              color: 'white',
              borderRadius: 4
            }} onClick={() => this.removeBill(bill)}>x</p>
          </div>
          { bill.description && <p>{bill.description}</p> }
        </div>
      );

    }

    return (
      <div style={{
        display: 'flex',
        flexDirection: isSmall ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: i % 2 ? 'white' : colors.light,
        padding: '0 12px'
      }}>
        <p style={{flex: 2, textAlign: 'left'}}>{bill.name}</p>
        <p style={{flex: 1, textAlign: 'left'}}>${bill.price}</p>
        <p style={{flex: 4, textAlign: 'left'}}>{bill.description}</p>
        <div style={{flex: 1, textAlign: 'right'}}>
          <p style={{
            display: 'inline',
            padding: '8px 14px',
            backgroundColor: colors.danger,
            color: 'white',
            borderRadius: 4
          }} onClick={() => this.removeBill(bill)}>x</p>
        </div>
      </div>
    );

  }

  renderBalance() {
    const share = Data.share;
    const total = this.state.person.total || 0;

    console.log({share, total});

    const difference = Math.abs(share - total);

    let payments = null;

    // They owe
    if (total > share) {

      const debtors = Data.people
        .filter(person => person.total < share);

      const totalCredit = Data.people
        .filter(person => person.total > share)
        .reduce((total, person) => total + (person.total - share), 0);

      console.log({totalCredit});

      const proportion = difference / totalCredit;

      payments = debtors.map(person => {

        const debt = share - person.total;

        return (
          <li style={{margin: 4}}>{person.name} owes you ${(debt * proportion).toFixed(2)}</li>
        );
      });

      // You owe
    } else {

      const creditors = Data.people.filter(person => person.total > share);

      const totalDebt = Data.people
        .filter(person => person.total < share)
        .reduce((total, person) => total + (person.total - share), 0);

      payments = creditors.map(person => {

        const proportion = (share - person.total) / totalDebt;

        const debt = proportion * difference;

        return (
          <li style={{margin: 4}}>You owe {person.name} ${debt.toFixed(2)}</li>
        );
      });
    }

    return (
      <ul>
        {payments}
      </ul>
    );
  }

  render() {

    const {person} = this.state;

    if (!person) {
      this.props.history.replace('/');
      return null;
    }

    const isSmall = Data.isSmall;

    return (
      <div style={{margin: 16, textAlign: 'center'}}>

        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <h1 style={{flex: 1}}>{person.name}</h1>
          <p style={{flex: 0, padding: 6, color: colors.danger, fontWeight: 'bold', cursor: 'pointer'}}
             onClick={this.removePerson}>X</p>
        </div>

        <form onSubmit={this.addBill}>

          <div style={{display: 'flex', flexDirection: isSmall ? 'column' : 'row', justifyContent: 'space-between'}}>
            <label style={{flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: 4}}>
              <span style={{flex: 1, marginBottom: 4, fontSize: 18}}>Expense</span>
              <input style={{
                flex: 1,
                fontSize: 18,
                padding: 4,
                borderRadius: 4,
                border: '1px solid #ccc',
                width: '100%',
                boxSizing: 'border-box'
              }} type="text"
                     placeholder="Name" value={this.state.name} onChange={this.update('name')}
                     ref={ref => this.input = ref}/>
            </label>

            <label style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: 4}}>
              <span style={{flex: 1, marginBottom: 4, fontSize: 18}}>Price</span>
              <input style={{
                flex: 1,
                fontSize: 18,
                padding: 4,
                borderRadius: 4,
                border: '1px solid #ccc',
                width: '100%',
                boxSizing: 'border-box'
              }}
                     min="0.01"
                     step=".01"
                     type="number" placeholder="Price" value={this.state.price} onChange={this.update('price')}/>
            </label>

            <label style={{flex: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: 4}}>
              <span style={{flex: 1, marginBottom: 4, fontSize: 18}}>Description</span>
              <input style={{
                flex: 1,
                fontSize: 18,
                padding: 4,
                borderRadius: 4,
                border: '1px solid #ccc',
                width: '100%',
                boxSizing: 'border-box'
              }} type="text"
                     value={this.state.description} onChange={this.update('description')}
              />
            </label>

          </div>

          <button
            style={{
              display: 'block',
              backgroundColor: colors.primary,
              margin: '16px auto',
              border: 'none',
              color: 'white',
              padding: '10px 16px',
              fontSize: 18,
              borderRadius: 4
            }}
          >Add expense
          </button>

        </form>

        <div style={{textAlign: 'left'}}>

          <h2 style={{marginTop: 12}}>Balance</h2>

          <p>The total is ${Data.total.toFixed(2)}. Split between {Data.people.length} people, that's
            ${Data.share.toFixed(2)} per
            person.</p>

          { this.renderBalance() }

          <div style={{
            marginTop: 42,
            marginBottom: 12,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{margin: 0}}>Expenses</h2>
            <h3 style={{margin: '0 4px 0 0'}}>${this.state.person.total.toFixed(2)}</h3>
          </div>

          { this.state.person.bills.length ?

            <div>
              { isSmall ? null : <div
                style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0 0 0 12px'}}>
                <p style={{flex: 2, textAlign: 'left', fontWeight: 'bold'}}>Expense</p>
                <p style={{flex: 1, textAlign: 'left', fontWeight: 'bold'}}>Price</p>
                <p style={{flex: 4, textAlign: 'left', fontWeight: 'bold'}}>Description</p>
                <p style={{
                  flex: 1,
                  textAlign: 'right',
                  padding: '0 14px',
                  backgroundColor: 'white',
                  fontWeight: 'bold',
                  borderRadius: 4
                }}>Remove</p>
              </div> }
              {this.state.person.bills.map(this.makeBill)}
            </div>

            : <p>You haven't added any expenses.</p>
          }
        </div>
      </div>
    );
  }
}

export default Person;
