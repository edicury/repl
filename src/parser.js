const { removeUnwantedKeys } = require("./utils");

const isNumber = (char = "") => {
    return char.match(new RegExp(/[0-9]/gi)) !== null;
}

const isOperator = (char = "") => {
    return char.match(new RegExp(/\+|\-|\*|\//gi)) !== null;
}

const isStartOfExpression = (char = "") => {
    return char.match(new RegExp(/\(/gi)) !== null;
}

const isEndOfExpression = (char = "") => {
    return char.match(new RegExp(/\)/gi)) !== null;
}

const isDisposableChar = (char = "") => {
    return char === " ";
}


const endOfExpression = (expression = "", index) => {
    let end = index;
    let subexpression = expression.substring(index, expression.length);
    let innerStartOfExpressions = 0;
    let innerEndOfExpressions = 0;
    let splitSubexpression = subexpression.split('');
    for (let i = 0; i <= splitSubexpression.length - 1; i += 1) {
        let char = splitSubexpression[i];
        if (isStartOfExpression(char)) {
            innerStartOfExpressions += 1;
        }

        if (isEndOfExpression(char)) {
            innerEndOfExpressions += 1;

            if (innerStartOfExpressions + 1 === innerEndOfExpressions) {
                end += i;
                break;
            }
        }
    }
    return end;
};


const ensureValidStatement = (statement = "") => {
    const validations = statement.split('')
        .reduce((acc, char) => {
            if (isStartOfExpression(char)) {
                acc.opening += 1;
            }
            if (isEndOfExpression(char)) {
                acc.closing += 1;
            }

            return acc;
        }, { opening: 0, closing: 0 });
    if (validations.opening !== validations.closing) {
        if (validations.opening > validations.closing) {
            throw new Error(`Missing ${validations.opening - validations.closing} )`)
        } else {

            throw new Error(`Missing ${validations.closing - validations.opening} (`)
        }
    }
}

const parseAST = (expression = "", index = 0, level = 0) => {
    ensureValidStatement(expression)

    return expression
        .substring(index, expression.length)
        .split('')
        .reduce((ast, char, idx) => {
            if (ast.currentExpressionEnd !== null) {
                return ast;
            } else {
                if (isDisposableChar(char)) {
                    ast.lastCharSpace = true;
                    return ast;
                }
                if (isStartOfExpression(char) && ast.operator !== null) {
                    const endIdx = endOfExpression(expression, idx + 1);
                    let subexpression = expression.substring(idx + 1, endIdx);
                    ast.children.push(parseAST(subexpression, 0, level++));
                    ast.currentExpressionEnd = endIdx;
                    return ast;
                } else {
                    if (isOperator(char)) {
                        ast.operator = char;
                    } else if (isNumber(char)) {
                        if (!ast.lastCharSpace) {
                            let el = ast.literals.pop();
                            var numb = el.toString() + char;

                            el = parseInt(numb);
                            ast.literals.push(el);
                        } else {
                            ast.literals.push(parseInt(char));
                        }
                    }
                    ast.lastCharSpace = false;
                    return ast;
                }
            }

        }, { operator: null, literals: [], children: [], currentExpressionEnd: null, lastCharSpace: false, level: level, });
}


const parse = (expression) => {
    const ast = parseAST(expression);
    const removed = removeUnwantedKeys(ast, ['currentExpressionEnd', 'lastCharSpace', 'level'])
    return removed;
}

exports.parse = parse;
exports.isNumber = isNumber;
exports.isDisposableChar = isDisposableChar;
exports.isEndOfExpression = isEndOfExpression;
exports.isStartOfExpression = isStartOfExpression;
exports.isOperator = isOperator;