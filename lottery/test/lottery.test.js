const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile')

let lottery;
let accounts;

beforeEach(async () => {

    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: '1000000'})

}) 

describe('Lottery contract', () => {

    it('deploy the contract', () => {
        // deploy successfully
        assert.ok(lottery.options.address);
    });

    it('init status check', async () => {
        const manager = await lottery.methods.manager().call()
        assert(accounts[0] == manager);
        const open = await lottery.methods.isOpen().call()
        assert(open)
        const players = await lottery.methods.getPlayers().call()
        assert(players.length == 0)
    })

    it('push player', async () => {

        await lottery.methods.enter().send({
            from: accounts[0], 
            value: web3.utils.toWei('0.011', 'ether')
        });
        
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        
        assert(accounts[0] == players[0]);
        assert(1 == players.length);
    });

    it('push multiple players', async () => {

        await lottery.methods.enter().send({
            from: accounts[0], 
            value: web3.utils.toWei('0.011', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1], 
            value: web3.utils.toWei('0.011', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2], 
            value: web3.utils.toWei('0.011', 'ether')
        });
        
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        
        assert(accounts[1] == players[1]);
        assert(3 == players.length);
    })

    it('require min amount', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[1],
                value : 0
            })
        } catch (err) {
            assert.ok(err)
        }
    })

    it('close the lottery by manager',  async () => {
        await lottery.methods.close().send({
            from: accounts[0], 
        });

        const open = await lottery.methods.isOpen().call()
        assert(false == open)
    })


    it('close the lottery by not manager',  async () => {
        try {
            await lottery.methods.close().send({
                from: accounts[1], 
            });
        } catch (exception) {
            assert.ok(exception)
        }
    })

    it('pick the winner by manager', async() => {
        
        // only add one player
        await lottery.methods.enter().send({
            from: accounts[0], 
            value: web3.utils.toWei('0.011', 'ether')
        });

        // this will cost not only 0.011, include the gas
        const initalBalance = await web3.eth.getBalance(accounts[0]);
 
        await lottery.methods.close().send({
            from: accounts[0]
        })
        
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        })

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initalBalance;

        // we need to consider the gas
        assert(difference > web3.utils.toWei('0.01', 'ether'));
    })

})
