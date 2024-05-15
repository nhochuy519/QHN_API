const express=require('express');

const {protect,restrictTo}= require('../controller/userController')

const {signupAdmin,loginAdmin,getAllUser,getAllOrder} = require('../controller/adminController');

const router = express.Router();


// router.post('/loginAdmin',login)
router.post('/signUpAdmin',protect,restrictTo('admin'),signupAdmin)
router.post('/loginAdmin',loginAdmin)

router.get('/getAllUser',protect,restrictTo('admin'),getAllUser)

router.get('/getALlOrder',protect,restrictTo('admin'),getAllOrder)



module.exports = router