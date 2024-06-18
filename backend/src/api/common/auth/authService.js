/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
const jwt = require('jsonwebtoken');
const config = require('config');

const UserService = require('../user/userService');
const cipher = require('./cipherHelper');
const emailService = require('../../../utils/emailService');

class AuthService {
  constructor() {
    this.userService = new UserService();
  }

  register(user) {
    const { email } = user;

    return this.userService.findByEmail(email)
      .then(existingUser => {
        if (existingUser) {
          throw new Error('User already exists');
        }

        const { salt, passwordHash } = cipher.saltHashPassword(user.password);
        const newUser = {
          email: user.email,
          fullName: user.fullName,
          role: 'user',
          age: 18,
          salt,
          passwordHash,
        };

        return this.userService.addUser(newUser);
      })
      .then(response => {
        if (response.result.ok === 1) {
          return this.userService.findByEmail(email);
        }
      });
  }

  resetPassword(password, confirmPassword, userId, resetPasswordToken) {
    let currentUserId = userId;

    if (password.length < 4) {
      return Promise.reject(new Error('Password should be longer than 4 characters'));
    }

    if (password !== confirmPassword) {
      return Promise.reject(new Error('Password and its confirmation do not match.'));
    }

    if (resetPasswordToken) {
      const tokenContent = cipher.decipherResetPasswordToken(resetPasswordToken);
      currentUserId = tokenContent.userId;

      if (new Date().getTime() > tokenContent.valid) {
        return Promise.reject(new Error('Reset password token has expired.'));
      }
    }

    const { salt, passwordHash } = cipher.saltHashPassword(password);

    return this.userService.changePassword(currentUserId, salt, passwordHash);
  }

  refreshToken(token) {
    if (!token.access_token || !token.refresh_token) {
      throw new Error('Invalid token format');
    }

    const tokenContent = jwt.decode(
      token.refresh_token,
      config.get('auth.jwt.refreshTokenSecret'),
      { expiresIn: config.get('auth.jwt.refreshTokenLife') },
    );

    return this.userService.findById(tokenContent.id).then(user => {
      return cipher.generateResponseTokens(user);
    });
  }

  requestPassword(email) {
    return this.userService
      .findByEmail(email)
      .then(user => {
        if (user) {
          const token = cipher.generateResetPasswordToken(user._id);

          return emailService.sendResetPasswordEmail(email, user.fullName, token);
        }

        throw new Error('There is no defined email in the system.');
      })
      .catch(error => {
        throw error;
      });
  }
}

module.exports = AuthService;
