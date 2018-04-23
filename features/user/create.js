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
    return callback(null, {
      statusCode: 201,
      body: JSON.stringify({
        user: user
      })
    })
  })
};
