const operate = (operator, a, b) => {
    switch (operator) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return a / b;
        default:
            throw new Error("Invalid operator")
    }
}


const traverse = (ast) => {
    if (ast.literals.length === 0) return 0;

    let operatedLiterals = ast.literals.reduce((acc, current) => {
        return operate(ast.operator, acc, current);
    });

    if (ast.children.length > 0) {
        for (let i = 0; i < ast.children.length; i++) {
            operatedLiterals = operate(ast.operator, operatedLiterals, traverse(ast.children[i]));
        }
    }
    return operatedLiterals;
}

exports.traverse = traverse;
exports.operate = operate;