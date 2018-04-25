'use strict';
const jwt = require('jwt-simple')
const cookie = require('cookie')
const tokenSecret = process.env.tokenSecret || 'a really awful secret'

module.exports.me = (event, context, cb) => {
  try {
    console.log('trying to verify cookie..', event.headers.cookie)
    const token = cookie.parse(event.headers.cookie).Authorization
    const decoded = jwt.decode(token, tokenSecret)
    console.log('token:', token)
    console.log('decoded:', decoded)
    return cb(null, {
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
      body: JSON.stringify({...decoded, isAuthenticated: true})
    })
  }catch(e) {
    console.log("uh oh:", e)
    return cb({
      statudCode: 401,
      body: JSON.stringify(e)
    }, {})
  }
}
