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
        new error('invalid username or password')
      }
      let expires = new Date()
      const token = jwt.encode({
        id: result.user.id,
        username: result.user.username,
        expiresAt: expires.setHours(expires.getHours()+ (60 * 60 * 24 * 7))
      }, tokenSecret)
      return callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS 
          "Set-Cookie": cookie.serialize('Authorization', token, {
            httpOnly: true,
            secure: event.requestContext.stage === 'dev' ? false : true,
            // expires: 60 * 60 * 24 * 7,
            maxAge: 60 * 60 * 24 * 7 // 1 week 
          }),
        },
        body: JSON.stringify({
          user: {...result.user, isAuthenticated: true}
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
