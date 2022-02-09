const { sum, multiply } = require('../../utils/testfunctions');

test('adds 2 + 2 to equal 4', () => expect(sum(2, 2)).toBe(4));

test('multiple 2 * 2', () => expect(multiply(2, 2)).toBe(4));
