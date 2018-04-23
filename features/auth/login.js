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
  const authenticate = User.authenticate()
  authenticate(body.username, body.password, function (err, user) {
    if (err) {
      return callback(new Error(err), {})
    } 
    let expires = new Date()
    const token = jwt.encode({
      id: user.id,
      username: user.username,
      expiresAt: expires.setHours(expires.getHours()+ (60 * 60 * 24 * 7))
    }, tokenSecret)
    // console.log('env:', process.env)
    return callback(null, {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS 
        "Set-Cookie": cookie.serialize('Authorization', token, {
          httpOnly: true,
          secure: true,
          // expires: expires.setHours(expires.getHours()+ (60 * 60 * 24 * 7)),
          maxAge: 60 * 60 * 24 * 7 // 1 week 
        }),
      },
      body: JSON.stringify({
        user: 'success'
      })
    })
  })
};
