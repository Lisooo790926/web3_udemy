const assert = require('assert') // like java mockito.assert
const ganache = require('ganache-cli')
const Web3 = require('Web3')

// get the ABI and evm from compilper
const { abi, evm } = require('../compile');

// use gnanche's provider (to define what kind of network connect to)
const web3 = new Web3(ganache.provider())

const expectMsg = ' This is initalMsg'

let accounts
let inbox

beforeEach(async () => {
    // get a list of account
    accounts = await web3.eth.getAccounts()

    // directly pass abi to contract
    inbox = await new web3.eth.Contract(abi)
        // assign bytecode method
        .deploy({ data: evm.bytecode.object, arguments: [" This is initalMsg"] }) // define the contract 
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