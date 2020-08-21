const { removeUnwantedKeys } = require("../src/utils");

describe('[removeUnwantedKeys] tests', () => {
    test('should remove all keys from complex object', () => {
        const object = { a: 1, b: 2, c: { b: 2 }, d: [1, 2, 3], e: [{ a: 1, b: 2 }] }
        const removed = removeUnwantedKeys(object, ['b']);
        const expected = { a: 1, c: {}, d: [1, 2, 3], e: [{ a: 1 }] }
        expect(JSON.stringify(removed, null, 2)).toBe(JSON.stringify(expected, null, 2))
    });

    test('should return the same object if keys is empty', () => {
        const object = { a: 1, b: 2 }
        const removed = removeUnwantedKeys(object);
        const expected = { a: 1, b: 2 }
        expect(JSON.stringify(removed, null, 2)).toBe(JSON.stringify(expected, null, 2))
    });
})