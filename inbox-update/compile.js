const path = require('path');
const fs = require('fs');
const solc = require('solc');

// it will available in IOS or Windows
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const testEventPath = path.resolve(__dirname, 'contracts', 'TestEvent.sol');
const inboxSource = fs.readFileSync(inboxPath, 'utf8');
const testEventSource = fs.readFileSync(testEventPath, 'utf8');

// 
const input = {
    language: 'Solidity',
    sources: {
        'Inbox.sol':{
            content: inboxSource
        }, 
        'TestEvent.sol': {
            content: testEventSource
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
}

const compileResult = JSON.parse(solc.compile(JSON.stringify(input)))

// solc.compile
module.exports = (contractName) => {
    return compileResult.contracts[contractName]
}

/**
 * JSON.parse(solc.compile(JSON.stringify(input))).contracts
 * {
      'Inbox.sol': {
        Inbox: {
          abi: [Array],
          devdoc: [Object],
          evm: [Object],
          ewasm: [Object],
          metadata: '{...}',
          storageLayout: [Object],
          userdoc: [Object]
        }
      }
    }
 */