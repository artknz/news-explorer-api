const router = require('express').Router();
const { getUsersMe } = require('../controllers/users');

router.get('/me', getUsersMe);

module.exports = router;
