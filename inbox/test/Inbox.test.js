// contract test code will go here
const assert = require('assert') // like java mockito.assert
// test network framework 
const ganache = require('ganache-cli')
// Web3 we should use as uppercase, because it will create instance web3 first, this is factory function
const Web3 = require('Web3')

// get the ABI and bytecode from compilper
const { interface, bytecode } = require('../compile');

// use gnanche's provider (to define what kind of network connect to)
const web3 = new Web3(ganache.provider())

const expectMsg = ' This is initalMsg'

let accounts
let inbox

beforeEach(async () => {
    // get a list of account
    // always async nature and be promise
    accounts = await web3.eth.getAccounts()

    // use one account to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [" This is initalMsg"] }) // define the contract 
        .send({ from: accounts[0], gas: '1000000' })  // deploy the contract
});

describe('Inbox', () => {
    it('deploy a contract', () => {
        // console.log(inbox)
        assert.ok(inbox.options.address) // check the address
    })

    it('has a default message', async () => {
        const msg = await inbox.methods.message().call()
        assert.equal(expectMsg, msg)
    })
    
    it('could set message', async () => {
        await inbox.methods.setMessage("here new one").send({from: accounts[0]})
        const message = await inbox.methods.message().call()
        assert.equal("here new one", message)
    })
})