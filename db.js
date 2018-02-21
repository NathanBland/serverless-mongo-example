const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise
const mongoose = Mongoose.connect('mongodb://admin:admin@ds243728.mlab.com:43728/items-db')
// const Product = require('./models/product')

const db = {
  mongoose
}

module.exports = db
