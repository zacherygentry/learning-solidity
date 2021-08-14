import logo from './logo.svg';
import './App.css';
import React from 'react';
import web3 from './web3';
import lottery from './lottery';

class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
  };

  componentDidMount() {
    this.setup();
  }

  setup = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance, value: '' });
  };

  onSubmit = async (ev) => {
    ev.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    });

    this.setState({ message: 'You have been entered in the lottery!' });
    this.setup();
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Deciding on winner...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({ message: 'A winner has been picked!' });
    this.setup();
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>

        <p>This lottery is managed by {this.state.manager}</p>

        <p>
          There are currently {this.state.players.length} players competing to
          win {web3.utils.fromWei(this.state.balance, 'ether')} ETH.
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={(ev) => this.setState({ value: ev.target.value })}
            />
          </div>
          <button type='submit'>Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
