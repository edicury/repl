const { traverse, operate } = require('../src/traverser');
const { parse } = require('../src/parser');

describe('[traverser] tests', () => {
    test('should traverse simple ast and return the value of the operation', () => {
        const expression = '(+ 1 2)';
        const ast = parse(expression);
        const traversed = traverse(ast);
        expect(traversed).toBe(3);
    });

    test('should traverse complex ast with multiple operations and return the value of the operation', () => {
        const expression = '(+ 1 (- 10 (* 5 (/ 10 10))))';
        const ast = parse(expression);
        const traversed = traverse(ast);
        expect(traversed).toBe(6);
    });

    test('should return 0 to empty literals', () => {
        const traversed = traverse({ operator: '+', literals: [], children: [] });
        expect(traversed).toBe(0);
    });
});

describe('[operate] tests', () => {
    test('should throw error of invalid operator for invalid operation', () => {
        try {
            operate('%', 1, 2);
        } catch (error) {
            expect(error.message).toBe('Invalid operator')
        }
    })
})
