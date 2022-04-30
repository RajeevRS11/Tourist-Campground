const express = require('express');
const router = express();
// const { validateCampground } = require('../middleware/validatecampground');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const userControllers = require('../controllers/users');

router
  .route('/register')
  .get(userControllers.renderRegister)
  .post(catchAsync(userControllers.register));

router
  .route('/login')
  .get(userControllers.renderLogin)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    userControllers.login
  );

router.get('/logout', userControllers.logout);

module.exports = router;
