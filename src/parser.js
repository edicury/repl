const { removeUnwantedKeys } = require("./utils");

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

const rules = {
    string: /".+"/gi,
    number: /[0-9.?0-9?]+/gi,
    symbol: /[\&|\%|\^\|\#|\@\!|\~|\<|\>|\?]+/gi,
    variable: /\w|(-|_)/gi,
}

const getToken = (token) => {
    const ruleKeys = Object.keys(rules);
    const tok = { type: null, value: null };
    for (let i = 0; i < ruleKeys.length; i++) {
        const rule = ruleKeys[i];
        const regex = new RegExp(rules[rule]);
        if (token.match(regex)) {
            tok.type = rule;
            if (rule === 'number') {
                if (token.match(/[0-9]+\.[0-9]+/gi)) {
                    tok.value = parseFloat(token);
                } else {
                    tok.value = parseInt(token);
                }
            } else {
                if (token.match(/".+"/gi)) {
                    tok.value = token.replace(/\"/gi, "")
                } else {
                    tok.value = token;
                    tok.type = "variable";
                }
            }
            break;
        }
    }
    if (tok.type === null && tok.value === null) {
        throw new Error(`invalid syntax with ${token}`);
    }
    return tok;
}

const parser = (expression) => {
    ensureValidStatement(expression)

    return expression.split('')
        .reduce((ast, char, idx) => {
            if (ast.insideStatement) return ast;
            if (idx === 0 && isStartOfExpression(char)) return ast;
            if (isDisposableChar(char)) {
                if (ast.currentToken !== '') {
                    if (ast.method === null) {
                        ast.method = ast.currentToken;
                    } else {
                        const tok = getToken(ast.currentToken);
                        ast.literals.push(tok);
                    }

                    ast.currentToken = '';
                }
                ast.space = true;
                return ast;
            } else {
                if (isStartOfExpression(char)) {
                    const endIdx = endOfExpression(expression, idx);
                    let subexpression = expression.substring(idx, endIdx);
                    ast.children.push(parser(subexpression));
                    ast.insideStatement = true;
                } else {
                    if (isEndOfExpression(char)) {
                        if (ast.currentToken !== '') {
                            if (ast.space) {
                                const tok = getToken(ast.currentToken);
                                ast.literals.push(tok);
                            }
                            ast.currentToken = '';
                            ast.space = false;
                            ast.insideStatement = false;
                        }
                    } else {
                        ast.currentToken += char;
                    }
                    return ast;
                }

                return ast;
            }

        }, { method: null, currentToken: '', literals: [], children: [], space: false, insideStatement: false })
}

const parse = (expression) => {
    const ast = parser(expression);
    const removed = removeUnwantedKeys(ast, ['currentToken', 'space', 'insideStatement'])
    return removed;
}

exports.parse = parse;
exports.isDisposableChar = isDisposableChar;
exports.isEndOfExpression = isEndOfExpression;
exports.isStartOfExpression = isStartOfExpression;