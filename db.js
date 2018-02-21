const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise
const mongoose = Mongoose.connect(process.env.DB_URI)
// const Product = require('./models/product')

module.exports = mongoose
