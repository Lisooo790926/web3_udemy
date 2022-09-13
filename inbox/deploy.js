const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const {interface, bytecode} = require('./compile')

// this is connect with provider based on your mnemonic phrases
const provider = new HDWalletProvider(
    '12 words here',  // your nmoneic, we could unlock and generate private and public key
    'https://rinkeby.infura.io/v3/9b3d8fecc24b49dea7ba19ce4387504a' // create real node 
    // set up real provider is really sucks, so use provider 
)

const web3 = new Web3(provider)

const deploy = async () => {

    const accounts = await web3.eth.getAccounts()
    
    console.log(accounts[0]);
    
    // get abi and deploy the contract
    const contract = await web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: ["this is initMsg"]})
        .send({from: accounts[0], gas: '1000000'})

    console.log('contract deployed to', contract.options.address)
    // to prevent a hanging deployment
    provider.engine.stop();
};

deploy();




