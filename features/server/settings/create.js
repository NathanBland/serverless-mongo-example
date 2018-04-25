'use strict';

module.exports.createSetting = (event, context, callback) => {
  const body = JSON.parse(event.body)
  const response = {
    statusCode: 200,
    body: JSON.stringify(body),
  };
  callback(null, response);
};
