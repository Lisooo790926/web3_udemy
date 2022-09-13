// compile code will go here

// bad! "require(file)  
// node engine will execute the file as javascript code
// require('./contracts/Inbox.sol'); 

// we have to read the content off from harddrive

// by using path, we could use crose platform to generate the valid path
const path = require('path');
// by using fileSystem module, we can read content 
const fs = require('fs');
const solc = require('solc');

// it will available in IOS or Windows
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

// also specify the number of contract attempting to the compiler, this time is only one
// print the result of compiler
// console.log(solc.compile(source, 1)) 

// here we will have bytecode and ABI
// solc.compile
module.exports = solc.compile(source, 1).contracts[':Inbox']
