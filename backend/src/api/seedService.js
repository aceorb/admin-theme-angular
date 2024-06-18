/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const UserService = require('./common/user/userService');
const cipher = require('./common/auth/cipherHelper');
const logger = require('../utils/logger');

const userService = new UserService();

class SeedService {
  checkAndSeed() {
    logger.info('Seed Data')
    userService.getCount()
      .then(count => {
        if (!count) {
          this.seed().then();
        }
      });
  }

  // function to add stub data for testing
  async seed() {
    try {
      logger.info('Seed Data');
      await this.addCustomUsers();
      await this.addRandomUsers(this.getNames());
      logger.info('Seed Users Done');
    } catch (err) {
      logger.error(err);
    }
  }

  addCustomUsers() {
    // add 2 custom users
    const usersToAdd = [];
    let hash = cipher.saltHashPassword('!2e4S');
    const admin = {
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@admin.admin',
      fullName: '@Admin',
      role: 'admin',
      age: 18,
      salt: hash.salt,
      passwordHash: hash.passwordHash,
    };
    usersToAdd.push(admin);

    hash = cipher.saltHashPassword('12345');
    const user = {
      firstName: 'User',
      lastName: 'User',
      email: 'user@user.user',
      fullName: '@User',
      role: 'user',
      age: 18,
      salt: hash.salt,
      passwordHash: hash.passwordHash,
    };
    usersToAdd.push(user);
    return userService.addMany(usersToAdd);
  }

  addRandomUsers(names) {
    const usersToAdd = [];
    for (let i = 0; i < 30; i++) {
      const hash = cipher.saltHashPassword(`pass_${i}`);
      const firstName = names[i].split(' ')[0];
      const lastName = names[i].split(' ')[1];
      const newUser = {
        email: `${firstName.toLowerCase()}_${lastName.toLowerCase()}@user.com`,
        fullName: `@User_${firstName}_${lastName}`,
        firstName,
        lastName,
        role: 'user',
        age: 18,
        salt: hash.salt,
        passwordHash: hash.passwordHash,
      };
      usersToAdd.push(newUser);
    }

    return userService.addMany(usersToAdd);
  }

  getNames() {
    return ['Rostand Simon', 'Petulia Samuel', 'Bacon Mathghamhain', 'Adlei Michael', 'Damian IvorJohn', 'Fredenburg Neil', 'Strader O\'\'Neal', 'Meill Donnell', 'Crowell O\'\'Donnell',
      'Lenssen Rory', 'Jac Names', 'Budge Mahoney', 'Bondy Simon', 'Bilow Ahearn', 'Weintrob Farrell', 'Tristan Cathasach', 'Baxy Bradach', 'Utta Damhan', 'Brag Treasach',
      'Vallie Kelly', 'Trutko Aodha', 'Mellins Cennetig', 'Zurek Casey', 'Star O\'\'Neal', 'Hoffer Names', 'Sturges Macshuibhne', 'Lifton Sioda', 'Rochell Ahearn', 'Lynsey Mcmahon',
      'Delp Seaghdha', 'Sproul O\'\'Brien', 'Omar Ahearn', 'Keriann Bhrighde', 'Killoran Sullivan', 'Olette Riagain', 'Kohn Gorman', 'Shimberg Maurice', 'Nalda Aodh',
      'Livvie Casey', 'Zoie Treasach', 'Kletter Daly', 'Sandy Mckay', 'Ern O\'\'Neal', 'Loats Maciomhair', 'Marlena Mulryan', 'Hoshi Naoimhin', 'Schmitt Whalen',
      'Patterson Raghailligh', 'Ardeen Kelly', 'Rasla Simon', 'Douty Cennetig', 'Giguere Names', 'Dorina Clark', 'Rothmuller Simon', 'Shabbir Delaney', 'Placidia Bradach',
      'Savior Keefe', 'Concettina Maguire', 'Malynda Muirchertach', 'Vanzant Fearghal', 'Schroder Ruaidh', 'Ainslie Ciardha', 'Richter Colman', 'Gianni Macghabhann',
      'Norvan O\'\'Boyle', 'Polak Mcneil', 'Bridges Macghabhann', 'Eisenberg Samuel', 'Thenna Daly', 'Moina Mcmahon', 'Gasper Whelan', 'Hutt O\'\'Keefe', 'Quintin Names',
      'Towny Reynold', 'Viviane Ceallachan', 'Girovard Power', 'Fanchon Flann', 'Nickolai Meadhra', 'Polash Login', 'Cacilia Macghabhann', 'Chaffee Rory', 'Baseler Conchobhar',
      'Amathiste Cuidightheach', 'Ishii Riagain', 'Marieann Damhan', 'Rangel Dubhain', 'Alarick Fionn', 'Humfrey Rory', 'Mable O\'\'Mooney', 'Jemie Macdermott', 'Hogen Rhys',
      'Cazzie Mohan', 'Airlie Reynold', 'Safire O\'\'Hannigain', 'Strephonn Nuallan', 'Brion Eoghan', 'Banquer Seaghdha', 'Sedgewinn Mcguire', 'Alma Macghabhann', 'Durward Mcnab'];
  }
}

module.exports = SeedService;
