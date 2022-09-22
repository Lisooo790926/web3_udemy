const assert = require('assert') // like java mockito.assert
const ganache = require('ganache-cli')
const Web3 = require('Web3')

// get the ABI and evm from compilper
const TestEvent = require('../compile')('TestEvent.sol').TestEvent;
const abi = TestEvent.abi
const evm = TestEvent.evm

// use gnanche's provider (to define what kind of network connect to)
const web3 = new Web3(ganache.provider())

var accounts;
var testEvent;

beforeEach(async () => {
    // get a list of account
    accounts = await web3.eth.getAccounts()

    // directly pass abi to contract
    testEvent = await new web3.eth.Contract(abi)
        // assign bytecode method
        .deploy({ data: evm.bytecode.object}) // define the contract 
        .send({ from: accounts[0], gas: '1000000' })  // deploy the contract
});

describe('TestEvent', async() => {

    it('Test log result', async() => {
        const utf8Encode = new TextEncoder();
        const byteArr = utf8Encode.encode("abc");
        testEvent.emitEvent(byteArr).send({from: accounts[0], value: 10000000}).then((result) => {
            console.log(result);
            var accountDetail = testEvent.at(accounts[0])
            accountDetail.Deposit((error, result) => console.log(result))
        });
    })

})

