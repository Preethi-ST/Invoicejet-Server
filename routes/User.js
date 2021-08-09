const express = require('express');
const router = express.Router();

//Middleware IMPORTS
const {RegAuth} = require('../middleware/RegAuth')
const {roleAuth} = require('../middleware/roleAuth')
const isAuthorized = require('../middleware/isAuthorized');

//CUSTOM IMPORTS
const Registration = require('../controller/UsersAuth/Registration')
const {Login, activateAccount, isLoggedIn, Logout} = require('../controller/UsersAuth/Login')
const ForgotPassword = require('../controller/UsersAuth/ForgotPassword');
const ResetPassword = require('../controller/UsersAuth/ResetPassword');
const View = require('../controller/Users_CRUD/View');
const Delete = require('../controller/Users_CRUD/Delete');
const Contact = require('../controller/UsersAuth/Contact');


router.post('/register',isAuthorized, RegAuth(['admin','manager','employee']),Registration)

router.post('/contact',Contact)

router.post('/login',Login)

router.get('/isLoggedIn',isLoggedIn)

router.get('/logout',Logout)

router.put('/activateAccount/:activateToken',activateAccount)

router.post('/forgotPassword',ForgotPassword)

router.put('/resetPassword/:resetToken',ResetPassword)

/*********************** USERS CRUD  ***********************/

router.get('/viewUsers',isAuthorized,roleAuth(['admin','manager','employee']),View)

router.delete('/deleteUser/:id',isAuthorized,roleAuth(['admin']),Delete)


module.exports = router;