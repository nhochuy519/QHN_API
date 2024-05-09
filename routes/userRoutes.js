const express=require('express');

const {signup,login,protect,restrictTo, deleteUser,editUserPass,sendProfile,profileUpdate,forgotPassword,resetPassword,addCart, getUsercart, upDateQuantity ,  deleteAllCart,getFavorites,addFavorites,removeFavorite}= require('../controller/userController')

const signupAdmin = require('../controller/adminController');
const { createOrder,orderPlaced ,deleteOrder} = require('../controller/PurchaseController');
const router = express.Router();



       /*
                UpdateUser
,                new table danh sách người đặt hàng
        
        */

// user admin
router.post('/signup',signup)
router.post('/login',login)




router.get('/profile',protect,sendProfile)

// router.route('/privacy')
//       .patch(protect,editUserPass)// chinh sua mat khau
//       .delete(protect,deleteUser) // xoa tai khoan


// quên mật khẩu

router.post('/forgotPassword',forgotPassword)
router.patch('/resetPassword',resetPassword)


router.post('/createOrder',protect,createOrder)

router.route('/orderPlaced')
      .get(protect,orderPlaced)
      .delete(protect,deleteOrder)
      // .get(protect,viewInvoice)// xem thong tin don hang
      // .post(protect,submitOrder) // mua hang
      // .delete(protect,deleteOrder) // xoá hàng


// router.route('/orderPlaced')
//       .get(protect,orderPlaced )


router.patch('/editProfile',protect,profileUpdate)     



router.route('/cart')
      .get(protect,getUsercart)
      .patch(protect,addCart)
      .delete(protect,deleteAllCart)

router.patch('/updateCartQuan',protect, upDateQuantity );

router.route('/favorite')
      .get(protect,getFavorites)  
      .patch(protect,addFavorites)
      .delete(protect,removeFavorite)


   
module.exports = router;
