const express = require('express');


const {  getProduct,
         aliasGirls,
         aliasBoys,
         aliasChildren ,
         postProduct,
         UpdateProduct,
         DeleteProduct,
         createComment,
         upDateCmt,
         deleteCmt
        } = require('../controller/productController')

const router = express.Router();

const {protect,restrictTo } = require('../controller/userController')

router.route('/girl')
        .get(aliasGirls,getProduct)
router.route('/men')
        .get(aliasBoys,getProduct)
router.route('/children')
        .get( aliasChildren ,getProduct )

router.route('/') //http://localhost:8000/product
        .get(getProduct)
        .post(protect,restrictTo('admin'),postProduct)// them san pham danh cho admin

router.patch('/comment/:id',protect,createComment);
router.patch('/comment/update/:id',protect, upDateCmt);
router.delete('/comment/deleteCmt/:id',protect, deleteCmt)




router.route("/:id") //http://localhost:8000/product/65d89ded2ffc0ebc68556221
        .patch(protect,restrictTo('admin') ,UpdateProduct)// chinh sua san pham danh cho admin
        .delete(protect,restrictTo('admin'),DeleteProduct)// xoa san pham danh cho admin
        


 

module.exports=router
