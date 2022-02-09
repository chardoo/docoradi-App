const express = require('express');;
const userController = require('../libs/controllers/userController');
const router = express.Router();


router.post('/userRegister', userController.registerUser);
router.post('/login', userController.loginUser);
module.exports = router;
