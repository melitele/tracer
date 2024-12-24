const test = require('node:test');
const assert = require('node:assert/strict');
const optimize = require('../lib/optimize');

test('optimize tracks', function () {
  const result = optimize([
    [[1, 1], [2, 2]],
    [[2, 2], [3, 3]],
    [[3, 3], [4, 4]]
  ]);
  assert.deepEqual(result, [
    [[1, 1], [2, 2], [3, 3], [4, 4]]
  ]);
});
