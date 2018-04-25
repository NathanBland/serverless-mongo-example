const uuid = require('uuid')
const mongoose = require('mongoose')

module.exports = (db) => {
  let user = new mongoose.Schema({
    // also tried new mongoose.Schema('user')...
    _id: {
      type: String,
      default: uuid.v4()
    },
    displayName: String,
    email: String,
    username: {
      type: String,
      unique: true
    }
  })
  user.plugin(require('passport-local-mongoose'))
  return db.model('user', user)
}
