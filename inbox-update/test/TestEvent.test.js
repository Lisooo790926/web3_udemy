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
var testEventContract;

beforeEach(async () => {
    // get a list of account
    accounts = await web3.eth.getAccounts()

    // directly pass abi to contract
    testEventContract = await new web3.eth.Contract(abi)
        // assign bytecode method
        .deploy({ data: evm.bytecode.object}) // define the contract 
        .send({ from: accounts[0], gas: '1000000' })  // deploy the contract
});

describe('TestEvent', async() => {

    it('Test log result', async() => {
        // give the action when event has been triggered
        testEventContract.events.Deposit((error, result) => {
            console.log(result.event)
            console.log(result.returnValues._id)
            // bytes32 can transform back to ascii
            console.log(Web3.utils.hexToAscii(result.returnValues._id))
        })
        testEventContract.events.Deposit2((error, result) => {
            console.log(result)
            console.log(result.returnValues._id)
        })
        testEventContract.methods.emitEvent(Web3.utils.asciiToHex("123")).send({from: accounts[0], value: 10000000})
        testEventContract.methods.emitEvent2("456").send({from: accounts[0], value: 10000000})
    })

    it('Test subscribe function', async() => {
        testEventContract.methods.emitEvent(Web3.utils.asciiToHex("123")).send({from: accounts[0], value: 10000000})
        // const filter = web3.eth.filter({from:  topics: [web3.sha3(Depo)})
        // testEventContract.queryFilter(filter).then((error, result) => console.log(result))
        // to be continue
    })

})

