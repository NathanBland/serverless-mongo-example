'use strict';
const jwt = require('jwt-simple')
const cookie = require('cookie')
const tokenSecret = process.env.tokenSecret || 'a really awful secret'

module.exports.me = (event, context, cb) => {
  try {
    console.log('[me.js] trying to verify cookie..')
    const token = cookie.parse(event.headers.Cookie || event.headers.cookie).Authorization
    const decoded = jwt.decode(token, tokenSecret)
    let expiresDate = new Date()
    expiresDate = new Date(expiresDate.setHours(expiresDate.getHours()+ (24 * 7)))
    const updatedToken = jwt.encode({
      id: token.id,
      username: token.username,
      expiresAt: expiresDate,
    }, tokenSecret)
    return cb(null, {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS 
        "Set-Cookie": cookie.serialize('Authorization', updatedToken, {
          httpOnly: true,
          secure: event.requestContext.stage === 'dev' ? false : true,
          expires: expiresDate,
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
