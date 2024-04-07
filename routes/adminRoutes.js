const express=require('express');

const {protect,restrictTo}= require('../controller/userController')

const {signupAdmin,loginAdmin} = require('../controller/adminController');

const router = express.Router();


// router.post('/loginAdmin',login)
router.post('/signUpAdmin',protect,restrictTo('admin'),signupAdmin)
router.post('/loginAdmin',loginAdmin)


module.exports = router