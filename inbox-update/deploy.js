const HDWalletProvider = require('@truffle/hdwallet-provider')
require('dotenv').config();
const Web3 = require('web3')
const {abi, evm} = require('./compile')
const { NMONEIC_PHRASE, API_URL } = process.env;

// this is connect with provider based on your mnemonic phrases
const provider = new HDWalletProvider(
    NMONEIC_PHRASE,  // your nmoneic, we could unlock and generate private and public key
    API_URL // create real node 
    // set up real provider is really sucks, so use provider 
)

const web3 = new Web3(provider)

const deploy = async () => {

    const accounts = await web3.eth.getAccounts()
    
    console.log('Attempting to deploy from account', accounts[0]);
    
    // get abi and deploy the contract
    const contract = await web3.eth.Contract(abi)
        .deploy({data: evm.bytecode.object, arguments: ["this is initMsg"]})
        .send({from: accounts[0], gas: '1000000'})

    console.log('contract deployed to', contract.options.address)
    // to prevent a hanging deployment
    provider.engine.stop();
};

deploy();




