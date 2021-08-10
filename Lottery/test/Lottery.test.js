const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
    })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei('0.02', 'ether') });

    const players = await lottery.methods.getPlayers().call();

    assert.strictEqual(players[0], accounts[0]);
    assert.strictEqual(players.length, 1);
  });

  it('allows multiple accounts to enter', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei('0.02', 'ether') });
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei('0.02', 'ether') });
    await lottery.methods
      .enter()
      .send({ from: accounts[2], value: web3.utils.toWei('0.02', 'ether') });

    const players = await lottery.methods.getPlayers().call();

    assert.strictEqual(players[0], accounts[0]);
    assert.strictEqual(players[1], accounts[1]);
    assert.strictEqual(players[2], accounts[2]);
    assert.strictEqual(players.length, 3);
  });

  it('requires a minimum amount of ether to enter', async () => {
    await assert.rejects(
      lottery.methods
        .enter()
        .send({ from: accounts[0], value: web3.utils.toWei('0.001', 'ether') })
    );
  });

  it('only manager can call pickWinner', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei('0.02', 'ether') });

    await assert.rejects(
      lottery.methods.pickWinner().send({ from: accounts[1] })
    );
  });

  it('sends money to the winner and resets the players array', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei('1', 'ether') });

    const initialBalance = await web3.eth.getBalance(accounts[1]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[1]);

    const difference = finalBalance - initialBalance;
    assert(difference > web3.utils.toWei('.9', 'ether'));

    const players = await lottery.methods.getPlayers().call();

    assert.strictEqual(players.length, 0);
  });
});
