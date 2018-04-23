'use strict';
const Mongoose = require('mongoose')
const passport = require('passport')
const jwt = require('jwt-simple')
const cookie = require('cookie')
const LocalStrategy = require('passport-local').Strategy
const tokenSecret = process.env.tokenSecret || 'a really awful secret'
Mongoose.Promise = global.Promise

module.exports.loginUser = (event, context, callback) => {
  const mongoose = Mongoose.createConnection(process.env.DB_URI)
  const User = require('../../models/user')(mongoose)
  const body = JSON.parse(event.body);
  // const authenticate = User.authenticate()
  console.log('login for:', body.username)
  User.db.once('open', () => {
    User.findOne({username: body.username})
    .then(user => {
      const authenticate = User.authenticate()
      return {result: authenticate(body.username, body.password), user: user}
    })
    .then((result) => {
      console.log('user object:', result)
      User.db.close()
      if (!result) {
        return callback(null, {
          statusCode: 401,
          body: JSON.stringify({
            user: 'Unauthorized'
          })
        })
      }
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          user: result.user
        })
      })
    })
  })
  .catch((e) => {
    return callback(null, {
      statusCode: 401,
      body: JSON.stringify({
        user: 'Unauthorized'
      })
    })  
  })
};
