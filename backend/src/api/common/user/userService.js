/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const jwt = require('jsonwebtoken');
const config = require('config');

const UserRepository = require('./userRepository');
const SettingService = require('../settings/settingsService');
const cipher = require('../auth/cipherHelper');
const CustomErrorService = require('../../../utils/customErrorService');

const settingService = new SettingService();

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  getCount() {
    return this.repository.getCount();
  }

  findByEmail(email) {
    return this.repository.findByEmail(email);
  }

  findById(id) {
    return this.repository.findById(id)
      .then(user => this.mapUserToDto(user));
  }

  addUser(user) {
    return this.repository.findByEmail(user.email).then((existingUser) => {
      if (existingUser) {
        throw new Error('User already exists');
      }
      return this.repository.add(user);
    })
  }

  addMany(users) {
    return this.repository.addMany(users);
  }

  editUser(dto, userId) {
    const user = this.mapDtoToUser(dto);

    return this.repository.findAllUsersByEmail(user.email)
      .then((users) => {
        if (this._isDuplicateEmail(users, userId)) {
          const errorData = {
            error: {
              code: 409,
              field: 'email',
              type: 'exist',
            },
          };

          throw new CustomErrorService('Email error', errorData);
        }

        return this.repository.edit(userId, user);
      })
      .then(() => this.findById(userId))
      .catch(error => {
        throw error;
      });
  }

  editCurrentUser(dto, userId) {
    return this.editUser(dto, userId)
      .then(user => {
        return cipher.generateResponseTokens(user);
      })
      .catch(error => {
        throw error;
      });
  }

  deleteUser(id) {
    return this.repository.delete(id);
  }

  changePassword(id, salt, passwordHash) {
    return this.repository.changePassword(id, salt, passwordHash);
  }

  getPhoto(token) {
    let decoded;

    try {
      decoded = jwt.verify(token, config.get('auth.jwt.accessTokenSecret'));
    } catch (err) {
      Promise.reject(new Error('invalid token'));
    }

    return this.repository.getPhoto(decoded.id);
  }

  list(filter) {
    return Promise.all([
      this.repository.listFiltered(filter),
      this.repository.getCountFiltered(filter),
    ])
      .then(([data, count]) => {
        return {
          items: data.map(item => this.mapUserToDto(item)),
          totalCount: count,
        };
      });
  }

  mapUserToDto(user) {
    return user ? {
      id: user._id,
      email: user.email,
      role: user.role,
      age: user.age,
      login: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address || {},
      settings: settingService.mapSettingsToDto(this.getSettings(user.settings)),
    } : {};
  }

  getSettings(settings) {
    return settings && settings.length ? settings[0] : settings;
  }

  mapDtoToUser(dto) {
    return dto ? {
      email: dto.email,
      age: dto.age,
      role: dto.role,
      fullName: dto.login,
      firstName: dto.firstName,
      lastName: dto.lastName,
      address: dto.address,
    } : {};
  }

  _isDuplicateEmail(users, userId) {
    if (users && users.length === 0) {
      return false;
    }

    if (users.length > 1) {
      return true;
    }

    return users.some(user => user._id.toString() !== userId.toString());
  }
}

module.exports = UserService;
