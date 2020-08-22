const { parse } = require('../src/parser');

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

        test('should throw invalid syntax error', () => {
            try {
                const expression = '(+ ` `)'
                parse(expression)
            } catch (error) {
                expect(error.message).toBe('invalid syntax with `');
            }
        })
    });
    describe('if valid statement', () => {
        test('should parse simple ast correctly', () => {
            const expression = '(+ 1 2.1)'
            const ast = parse(expression);
            const expectedAst = {
                method: '+',
                literals: [{ type: 'number', value: 1 }, { type: 'number', value: 2.1 }],
                children: []
            }
            expect(JSON.stringify(ast, null, 2)).toBe(JSON.stringify(expectedAst, null, 2));
        });
        test('should parse complex ast correctly', () => {
            const expression = '(+ 10 (+ 2 (+ 30 4)))'
            const ast = parse(expression);
            const expectedAst = {
                method: '+',
                literals: [{ type: 'number', value: 10 }],
                children: [{
                    method: '+',
                    literals: [{ type: 'number', value: 2 }],
                    children: [{
                        method: '+',
                        literals: [{ type: 'number', value: 30 }, { type: 'number', value: 4 }],
                        children: []
                    }]
                }]
            }

            expect(JSON.stringify(ast, null, 2)).toBe(JSON.stringify(expectedAst, null, 2));
        });
        test('should parse complex with variables ast correctly', () => {
            const expression = '(+ 10 (+ 2 (+ 30 a)))'
            const ast = parse(expression);
            const expectedAst = {
                method: '+',
                literals: [{ type: 'number', value: 10 }],
                children: [{
                    method: '+',
                    literals: [{ type: 'number', value: 2 }],
                    children: [{
                        method: '+',
                        literals: [{ type: 'number', value: 30 }, { type: 'variable', value: 'a' }],
                        children: []
                    }]
                }]
            }

            expect(JSON.stringify(ast, null, 2)).toBe(JSON.stringify(expectedAst, null, 2));
        })
    });
})
