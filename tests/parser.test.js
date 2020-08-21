const { parse, isDisposableChar, isEndOfExpression, isNumber, isOperator, isStartOfExpression } = require('../src/parser');

describe('[parser] tests', () => {
    describe('if invalid statement', () => {
        test('should report 1 missing closing parentheses on wrong statement', () => {
            try {
                const expression = '(+ 1 2'
                parse(expression);
            } catch (error) {
                expect(error.message).toBe('Missing 1 )');
            }
        });

        test('should report 1 missing opening parentheses on wrong statement', () => {
            try {
                const expression = '+ 1 2)'
                parse(expression);
            } catch (error) {
                expect(error.message).toBe('Missing 1 (');
            }
        });
    });
    describe('if valid statement', () => {
        test('should parse simple ast correctly', () => {
            const expression = '(+ 1 2)'
            const ast = parse(expression);
            const expectedAst = {
                operator: '+',
                literals: [1, 2],
                children: []
            }
            expect(JSON.stringify(ast, null, 2)).toBe(JSON.stringify(expectedAst, null, 2));
        });
        test('should parse complex ast correctly', () => {
            const expression = '(+ 10 (+ 2 (+ 30 4)))'
            const ast = parse(expression);
            const expectedAst = {
                operator: '+',
                literals: [10],
                children: [{
                    operator: '+',
                    literals: [2],
                    children: [{
                        operator: '+',
                        literals: [30, 4],
                        children: []
                    }]
                }]
            }

            expect(JSON.stringify(ast, null, 2)).toBe(JSON.stringify(expectedAst, null, 2));
        })
    });
    describe('[isNumber] - tests', () => {
        test('isNumber finds number in char', () => {
            expect(isNumber("1")).toBe(true);
        })
        test('isNumber does not find number in char', () => {
            expect(isNumber("a")).toBe(false);
        })
    })
    describe('[isDisposableChar] - tests', () => {
        test('isDisposableChar finds empty char', () => {
            expect(isDisposableChar(" ")).toBe(true);
        })
        test('isDisposableChar does not find empty char', () => {
            expect(isDisposableChar("a")).toBe(false);
        })
    })
})
