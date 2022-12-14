const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const {interface, bytecode} = require('./compile')

require('dotenv').config();
const { NMONEIC_PHRASE, API_URL } = process.env;

// this is connect with provider based on your mnemonic phrases
const provider = new HDWalletProvider(
    NMONEIC_PHRASE,  // your nmoneic, we could unlock and generate private and public key
    API_URL // create real node 
)

const web3 = new Web3(provider)

const deploy = async () => {

    const accounts = await web3.eth.getAccounts()
    
    console.log(accounts[0]);
    
    // get abi and deploy the contract
    const contract = await web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: '1000000'})

    console.log('contract deployed to', contract.options.address)
    // to prevent a hanging deployment
    provider.engine.stop();
};

deploy();




