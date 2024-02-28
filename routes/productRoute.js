const express = require('express');


const {getController,aliasGirls,aliasBoys, aliasChildren ,postProduct} = require('../controller/productController')

const router = express.Router();


router.route('/girl')
        .get(aliasGirls,getController)
router.route('/men')
        .get(aliasBoys,getController)
router.route('/children')
        .get( aliasChildren ,getController )

router.route('/')
        .get(getController)
        .post(postProduct)



module.exports=router
