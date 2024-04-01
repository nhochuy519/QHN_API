const express=require('express');

const {signup,login,protect,restrictTo, deleteUser,editUser}= require('../controller/userController')

const signupAdmin = require('../controller/adminController');
const { submitOrder,viewInvoice,deleteOrder } = require('../controller/PurchaseController');
const router = express.Router();



       /*
                UpdateUser
                DeleteUser 
                new table danh sách người đặt hàng
        
        */

// user admin
router.post('/signup',signup)
router.post('/login',login)

router.route('/privacy')
      .patch(protect,editUser)
      .delete(protect,deleteUser)


router.route('/purchase')
      .get(protect,viewInvoice)
      .post(protect,submitOrder)
      .delete(protect,deleteOrder)

//admin
router.post('/signUpAdmin',protect,restrictTo('admin'),signupAdmin)





module.exports = router;
