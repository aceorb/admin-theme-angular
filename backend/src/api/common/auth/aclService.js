/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

function adminGuard(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).send({ error: 'User should have admin access to use this endpoint' });
  }
}

module.exports = {
  adminGuard,
};
