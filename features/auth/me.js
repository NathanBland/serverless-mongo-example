'use strict';
const jwt = require('jwt-simple')
const cookie = require('cookie')
const tokenSecret = process.env.tokenSecret || 'a really awful secret'

module.exports.me = (event, context, cb) => {
  try {
    console.log('trying to verify cookie..', event)
    const token = cookie.parse(event.headers.Cookie).Authorization
    const decoded = jwt.decode(token, tokenSecret)
    console.log('token:', token)
    console.log('decoded:', decoded)
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS 
        "Set-Cookie": cookie.serialize('Authorization', token, {
          httpOnly: true,
          secure: true,
          expires: 60 * 60 * 24 * 7,
          maxAge: 60 * 60 * 24 * 7 // 1 week 
        }),
      },
      body: JSON.stringify(decoded)
    }
  }catch(e) {
    return {
      statudCode: 401,
      body: JSON.stringify(e)
    }
  }
}
