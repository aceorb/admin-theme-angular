/*
 * Copyright (c) Akveo 2020. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

class CustomErrorService extends Error {
  constructor(message, metadata = {}) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.message = message;
    this.metadata = metadata;
  }
}

module.exports = CustomErrorService;
