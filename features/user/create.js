'use strict';
const Mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
Mongoose.Promise = global.Promise

module.exports.createUser = (event, context, callback) => {
  const mongoose = Mongoose.createConnection(process.env.DB_URI)
  const User = require('../../models/user')(mongoose)
  const body = JSON.parse(event.body);
  User.plugin(require('passport-local-mongoose'))
  User.register(new User({
    displayName: '',
    email: body.username,
    username: body.username
  }), body.password, (err, user) => {
    if (err) {
      return callback(new Error(err))
    }
    passport.authenticate('local', {session: false})(event, callback, function () {
      let expires = new Date()
      const token = jwt.encode({
        id: req.user.id,
        username: req.user.username,
        expiresAt: expires.setHours(expires.getHours()+8)
      }, tokenSecret)
      return callback(null, {
        statusCode: 201,
        body: JSON.stringify({
          user: 'created'
        })
      })
    })
  })

  // User.db.once('open', () => {
  //   user.save()
  //   .then(user => {
  //     User.db.close()
  //     return callback(null, {
  //       statusCode: 201,
  //       body: JSON.stringify({
  //         user: 'created'
  //       })
  //     })
  //   })
  //   .catch(err => {
  //     User.db.close()
  //     return callback(new Error(err))
  //   })
  // })
  // callback(null, response);
};
