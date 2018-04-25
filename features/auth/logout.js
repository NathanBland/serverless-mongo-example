'use strict';
const jwt = require('jwt-simple')
const cookie = require('cookie')
const tokenSecret = process.env.tokenSecret || 'a really awful secret'

module.exports.logout = (event, context, callback) => {
  if (!event.headers.Cookie && !event.headers.cookie) {
    console.log('no cookie. headers:', event.headers)
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: 'No session to destroy'
      })
    })
  }
  try {
    //TODO: we should blacklist the existing token here. OR whitelist active ones
    console.log('[logout.js] trying to verify cookie..')
    const token = cookie.parse(event.headers.Cookie || event.headers.cookie).Authorization
    const decoded = jwt.decode(token, tokenSecret)
    console.log('decoded:', decoded)
    let expiresDate = new Date()
    expiresDate = new Date(expiresDate.setHours(expiresDate.getHours() - (24 * 7)))
    const updatedToken = jwt.encode({
      id: token.id,
      username: token.username,
      expiresAt: expiresDate,
    }, tokenSecret)
    return callback(null, {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS 
        "Set-Cookie": cookie.serialize('Authorization', updatedToken, {
          httpOnly: true,
          secure: event.requestContext.stage === 'dev' ? false : true,
          expires: expiresDate,
          maxAge: -1 // 1 week 
        }),
      },
      body: JSON.stringify({...decoded, isAuthenticated: true})
    })
  }catch(e) {
    console.log("uh oh, failed to parse cookie, aborting:")
    return callback(null, {
      statudCode: 401,
      body: JSON.stringify(e)
    })
  }
}
