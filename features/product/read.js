'use strict';
// const db = require('../../db.js')
const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise

module.exports.readProduct = (event, context, callback) => {
  const mongoose = Mongoose.createConnection(process.env.DB_URI)
  const Product = require('../../models/product')(mongoose)
  
  let productId = ""
  let query = {}
  if (event.pathParameters) {
    query = {_id: event.pathParameters.id}
  }
  console.time('query')
  Product.db.once('open', () => {
    Product.find(query)
    .then(product => {
      Product.db.close()
      console.timeEnd('query')
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
  })
    
  // callback(null, response);
};
