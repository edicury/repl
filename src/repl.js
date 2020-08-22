const prompt = require('prompt-sync')({ sigint: false });
const { traverse } = require('./traverser');
const { parse } = require('./parser');

let isTreeMode = false;
while (true) {
    if (isTreeMode) {
        let statement = prompt('tree> ');
        if (statement === "exit") {
            isTreeMode = false;
        } else {
            try {
                const parsedAST = parse(statement);
                console.log(JSON.stringify(parsedAST, null, 2));
            } catch (error) {
                console.log(`error: ${error.message}`);
            }
        }
    } else {
        let statement = prompt('repl> ');
        if (statement === null) {
            process.exit(0);
        } else if (statement === "tree") {
            isTreeMode = true;
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
}