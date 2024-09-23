const express = require('express') ;
const { register, login, logout, updateUserProfile, getUserProfile } = require('../controllers/user.controller.js');

const router = express.Router() ;

router.route('/register').post(register) ;
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/profile/update/:id').put(updateUserProfile);
router.route('/profile').post(getUserProfile) ;
module.exports = router