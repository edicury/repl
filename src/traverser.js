const methods = {
    '+': (args) => args.reduce((acc, curr) => acc + curr),
    '-': (args) => args.reduce((acc, curr) => acc - curr),
    '*': (args) => args.reduce((acc, curr) => acc * curr),
    '/': (args) => args.reduce((acc, curr) => acc / curr),
    '%': (args) => args.reduce((acc, curr) => acc % curr),
    '=': (args = []) => {
        const comparable = args[0];
        args.shift();
        return args.filter((arg) => arg !== comparable).length === 0
    }
}


const operate = (operator, args) => {
    const method = methods[operator];
    if (method === null || method === undefined) {
        // TODO: compile extra methods
        throw new Error('Invalid method')
    } else {
        const value = method(args);
        return value;
    }
}


const traverse = (ast) => {
    if (ast.literals.length === 0) return 0;

    const values = ast.literals.map(literals => literals.value);

    let operatedLiterals = operate(ast.method, values);

    if (ast.children.length > 0) {
        for (let i = 0; i < ast.children.length; i++) {
            const vals = [operatedLiterals, traverse(ast.children[i])];
            operatedLiterals = operate(ast.method, vals);
        }
    }
    return operatedLiterals;
}

exports.traverse = traverse;
exports.operate = operate;