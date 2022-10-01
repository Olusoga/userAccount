const router = require('express').Router();

const {register } = require('../controller/user');

router.post('/', register);


module.exports = router;