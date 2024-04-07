const { getProduct } = require('../models/dataModel');
const dataModel = require('./dataModel')

test('', () => {
  expect((getProduct(1))).toBe('product id = 1');
});