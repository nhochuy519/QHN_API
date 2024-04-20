const express=require('express');

const {signup,login,protect,restrictTo, deleteUser,editUserPass,sendProfile,profileUpdate,forgotPassword,resetPassword}= require('../controller/userController')

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




router.get('/profile',protect,sendProfile)

router.route('/privacy')
      .patch(protect,editUserPass)// chinh sua mat khau
      .delete(protect,deleteUser) // xoa tai khoan


// quên mật khẩu

router.post('/forgotPassword',forgotPassword)
router.patch('/resetPassword',resetPassword)


router.route('/purchase')
      .get(protect,viewInvoice)// xem thong tin don hang
      .post(protect,submitOrder) // mua hang
      .delete(protect,deleteOrder) // xoá hàng


router.patch('/editProfile',protect,profileUpdate)     






module.exports = router;
