'use strict';
const db = require('../../db.js')
const Product = require('../../models/product')

module.exports.createProduct = (event, context, callback) => {
  const body = JSON.parse(event.body);

  const product = new Product({
    name: body.name,
    itemCode: body.itemCode,
    price: body.price,
    stock: body.stock,
    imageURL: body.imageURL
  })
  product.save()
  .then(product => {
    Product.db.close()
    return callback(null, {
      statusCode: 201,
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
