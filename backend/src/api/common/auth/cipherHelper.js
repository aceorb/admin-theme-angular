/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const crypto = require('crypto');
const config = require('config');
const jwt = require('jsonwebtoken');

const {
  secret, ttl, algorithm, inputEncoding, outputEncoding,
} = config.get('auth.resetPassword');

function genRandomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

function getStringValue(data) {
  if (typeof data === 'number' || data instanceof Number) {
    return data.toString();
  }
  if (!Buffer.isBuffer(data) && typeof data !== 'string') {
    throw new TypeError('Data for password or salt must be a string or a buffer');
  }
  return data;
}

function sha512(password, salt) {
  const hash = crypto.createHmac('sha512', getStringValue(salt));
  hash.update(getStringValue(password));
  const passwordHash = hash.digest('hex');

  return {
    salt,
    passwordHash,
  };
}

function saltHashPassword(password) {
  const salt = genRandomString(16);
  return sha512(getStringValue(password), salt);
}

function generateResetPasswordToken(userId) {
  const text = JSON.stringify({ userId, valid: new Date().getTime() + ttl });

  const cipher = crypto.createCipher(algorithm, secret);
  let ciphered = cipher.update(text, inputEncoding, outputEncoding);
  ciphered += cipher.final(outputEncoding);

  return ciphered;
}

function decipherResetPasswordToken(ciphered) {
  const decipher = crypto.createDecipher(algorithm, secret);
  let deciphered = decipher.update(ciphered, outputEncoding, inputEncoding);
  deciphered += decipher.final(inputEncoding);

  return JSON.parse(deciphered);
}

function generateResponseTokens(user) {
  const normalizedUser = { id: user.id, role: user.role, email: user.email };
  const accessToken = jwt.sign(
    normalizedUser,
    config.get('auth.jwt.accessTokenSecret'),
    { expiresIn: config.get('auth.jwt.accessTokenLife') },
  );
  const refreshToken = jwt.sign(
    normalizedUser,
    config.get('auth.jwt.refreshTokenSecret'),
    { expiresIn: config.get('auth.jwt.refreshTokenLife') },
  );

  return {
    expires_in: config.get('auth.jwt.accessTokenLife'),
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}

module.exports = {
  saltHashPassword,
  sha512,
  generateResetPasswordToken,
  decipherResetPasswordToken,
  generateResponseTokens,
};
