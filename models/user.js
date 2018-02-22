const uuid = require('uuid')
const mongoose = require('mongoose')

module.exports = (db) => {
  let user =  db.model('user', {
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
  // user.plugin()
  return user
}
//  = product