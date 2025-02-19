const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const AuthServices = require('../services/auth');
const service = new AuthServices()
const {  loginAuthSchema,  recoveryAuthSchema,  changePasswordAuthSchema,} = require('../schemas/auth.schema');
const router = express.Router();
const {validatorHandler} = require('../middlewares/validator.handler');

router.post('/login',
  validatorHandler(loginAuthSchema, 'body'),
  passport.authenticate('local', {session:false}),
  async (req, res, next) => {
    try {
      const user = req.user
      console.log(user)
      res.status(201).json(service.signToken(user));
    } catch (error) {
      next(error);
    }
  }
);

router.post('/recovery',
  //validatorHandler(recoveryAuthSchema, 'body'),
  async (req, res, next) => {
    try {
      const {email} = req.body
      const rta = await service.sendRecovery(email)
      console.log('rta' , rta)
      res.status(201).json(rta);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/change-password',
  validatorHandler(changePasswordAuthSchema, 'body'),
  async (req, res, next) => {
    try {
      const {token, newPassword} = req.body
      const rta = await service.changePassword(token, newPassword)
      res.status(201).json(rta);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
