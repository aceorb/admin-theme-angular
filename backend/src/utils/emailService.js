/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License. 
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const config = require('config');
const logger = require('../utils/logger');

const { domain } = config.get('frontEnd');

function doSend(email, text) {
  logger.info(text);
  return Promise.resolve(true);
}

function sendResetPasswordEmail(email, fullName, token) {
  const text = `Hello ${fullName},`
  + '\nWe have received password reset request. '
  + `To do this, please proceed at ${domain}/#/auth/reset-password?reset_password_token=${token}`
  + '\nIf it wasn\'t you, take no action or contact support.'
  + '\n\nThank you,'
  + '\nSupport team.';

  return doSend(email, text);
}

module.exports = {
  sendResetPasswordEmail,
};
