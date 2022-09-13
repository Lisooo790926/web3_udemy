const path = require('path');
const fs = require('fs');
const solc = require('solc');

// it will available in IOS or Windows
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

// 
const input = {
    language: 'Solidity',
    sources: {
        'Inbox.sol':{
            content: source
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

// solc.compile
module.exports = JSON.parse(solc.compile(JSON.stringify(input)))
    .contracts['Inbox.sol'].Inbox

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