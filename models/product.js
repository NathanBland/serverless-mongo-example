const uuid = require('uuid')
const mongoose = require('mongoose')

module.exports = (db) => {
  return db.model('product', {
    _id: {
      type: String,
      default: uuid.v4()
    },
    name: String,
    itemCode: String,
    price: Number,
    stock: {
      type: Number,
      default: 1
    },
    imageURL: String
  })
}
//  = product