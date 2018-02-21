'use strict';
const db = require('../../db.js')
const Product = require('../../models/product')

module.exports.readProduct = (event, context, callback) => {
  let productId = ''
  let query = {}
  if (event.pathParameters) {
    query = {_id: event.pathParameters.id}
  }
  Product.find(query)
  .then(product => {
    Product.db.close()
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        product: product
      })
    })
  })
  .catch(err => {
    Product.db.close()
    return callback(new Error(err))
  })

  // callback(null, response);
};
