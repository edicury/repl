const prompt = require('prompt-sync')({ sigint: false });
const { traverse } = require('./traverser');
const { parse } = require('./parser');

while (true) {
    let statement = prompt('repl> ');
    if (statement === null) {
        process.exit(0);
    } else {
        try {

            const parsedAST = parse(statement);
            const traversed = traverse(parsedAST);
            console.log(traversed);
        } catch (error) {
            console.log(`error: ${error.message}`);
        }
    }
}