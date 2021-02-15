const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const users = require('./users');
const articles = require('./articles');
const error = require('./error');

const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use('/articles', auth, articles);
router.use('/users', auth, users);

router.use('*', auth, error);

module.exports = router;
