'use strict';
const Mongoose = require('mongoose')
const passport = require('passport')
const jwt = require('jwt-simple')
const cookie = require('cookie')
const LocalStrategy = require('passport-local').Strategy
const tokenSecret = process.env.tokenSecret || 'a really awful secret'
Mongoose.Promise = global.Promise

module.exports.createUser = (event, context, callback) => {
  const mongoose = Mongoose.createConnection(process.env.DB_URI)
  const User = require('../../models/user')(mongoose)
  const body = JSON.parse(event.body);

  User.register(new User({
    displayName: '',
    email: body.username,
    username: body.username
  }), body.password, (err, user) => {
    if (err) {
      console.error('err:', err)
      return callback(new Error(err))
    }
    passport.authenticate('local', {session: false})(event, callback, function () {
      let expiresDate = new Date()
      expiresDate = new Date(expiresDate.setHours(expiresDate.getHours()+ (24 * 7)))
      const token = jwt.encode({
        id: user.id,
        username: user.username,
        expiresAt: expiresDate
      }, tokenSecret)
      return callback(null, {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS 
          "Set-Cookie": cookie.serialize('Authorization', token, {
            httpOnly: true,
            secure: event.requestContext.stage === 'dev' ? false : true,
            expires: expiresDate,
            maxAge: 60 * 60 * 24 * 7 // 1 week 
          }),
        },
        body: JSON.stringify({
          user: {...user, isAuthenticated: true}
        })
      })
    })
  })
};
