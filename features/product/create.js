'use strict';
const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise

module.exports.createProduct = (event, context, callback) => {
  const mongoose = Mongoose.createConnection('mongodb://admin:admin@ds243728.mlab.com:43728/items-db')
  const Product = require('../../models/product')(mongoose)
  const body = JSON.parse(event.body);

  const product = new Product({
    name: body.name,
    itemCode: body.itemCode,
    price: body.price,
    stock: body.stock,
    imageURL: body.imageURL
  })
  Product.db.once('open', () => {
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
  })

  // callback(null, response);
};
